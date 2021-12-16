import { refresh } from "@lincode/reactivity"
import { extendFunction, pull, throttle, traverse } from "@lincode/utils"
import { assignFileUnsaved } from "./useFileUnsaved"
import { getGameEditorTab } from "./useGameEditorTab"
import autoResetStore from "./utils/autoResetStore"
import { nonSerializedProperties } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"
import type { BaseSceneGraphNode, AnimationNode } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"
import { assignGameEditorGraphs } from "./useGameEditorGraphs"
import { nanoid } from "nanoid"
import { emitGameEditorSelectionTarget } from "../events/onGameEditorSelectionTarget"
import { emitGameEditorMultipleSelection } from "../events/onGameEditorMultipleSelection"
import { refreshGameEditorSelection } from "../events/onGameEditorSelection"
import { emitGameEditorMultipleSelectionEnabled } from "../events/onGameEditorMultipleSelectionEnabled"

type BaseNodeParent = Array<BaseNode> | BaseNode

export type BaseNode = BaseSceneGraphNode & {
    update?: number,
    parent?: BaseNodeParent
}
export const baseNodeUnsavedProperties = <const>["parent", "update"]
export const nonDisplayProperties = [...nonSerializedProperties, ...baseNodeUnsavedProperties]

export type SceneGraph = {
    baseNodes: Array<BaseNode>
    animationNodes: Array<AnimationNode>
}

export const [useGameEditorGraph, setGameEditorGraph, getGameEditorGraph, resetGameEditorGraph] = autoResetStore<SceneGraph>({
    baseNodes: [], animationNodes: []
})

const initBaseNode = (node: BaseNode, parent: BaseNodeParent) => {
    !node.uuid && (node.uuid = nanoid())
    node.parent = parent
}

export const initBaseNodes = (nodes: BaseNodeParent) => {
    traverse(nodes, (_, v, parent) => {
        if (v && typeof v === "object" && !Array.isArray(v))
            initBaseNode(v, parent as BaseNodeParent)
    })
}

const refreshGameEditorGraph = throttle(extendFunction(refresh(setGameEditorGraph, getGameEditorGraph), () => {
    const tab = getGameEditorTab()
    if (!tab) return

    assignFileUnsaved({ [tab]: true })
    assignGameEditorGraphs({ [tab]: getGameEditorGraph() })
    
}), 0, "trailing")

const updateBaseNode = (node: BaseNode, properties?: Record<string, any>) => {
    properties && Object.assign(node, properties)
    node.update ??= 0
    node.update++
    refreshGameEditorGraph()
}

const addBaseNode = (node: BaseNode) => {
    const { baseNodes } = getGameEditorGraph()
    initBaseNode(node, baseNodes)
    node.children && initBaseNodes(node.children)
    baseNodes.push(node)
    refreshGameEditorGraph()
}

const removeBaseNode = (node: BaseNode) => {
    if (Array.isArray(node.parent)) {
        pull(node.parent, node)
        refreshGameEditorGraph()
    }
    else if (node.parent?.children) {
        pull(node.parent.children, node)
        updateBaseNode(node.parent)
    }
}

export const userAddBaseNode = (node: BaseNode) => {
    refreshGameEditorSelection()
    queueMicrotask(() => {
        addBaseNode(node)
        setTimeout(() => setTimeout(() => emitGameEditorSelectionTarget(node)))
    })
}

export const userAddBaseNodes = (nodes: Array<BaseNode | undefined>) => {
    emitGameEditorSelectionTarget(undefined)
    queueMicrotask(() => {
        for (const node of nodes)
            node && addBaseNode(node)

        emitGameEditorMultipleSelection(true)
        queueMicrotask(() => {
            for (const node of nodes)
                emitGameEditorSelectionTarget(node)

            emitGameEditorMultipleSelection(false)
        })
    })
}

export const userUpdateBaseNode = (node: BaseNode, properties: Record<string, any>) => {
    emitGameEditorMultipleSelectionEnabled(false)
    queueMicrotask(() => {
        updateBaseNode(node, properties)
        emitGameEditorMultipleSelectionEnabled(true)
    })
}

export const userUpdateBaseNodes = (
    entries: () => Array<[node: BaseNode | undefined, properties: Record<string, any>]>
) => {
    emitGameEditorMultipleSelectionEnabled(false)
    queueMicrotask(() => {
        for (const [node, properties] of entries())
            node && updateBaseNode(node, properties)

        emitGameEditorMultipleSelectionEnabled(true)
    })
}

export const userRemoveBaseNodes = (node: Array<BaseNode | undefined>) => {
    emitGameEditorSelectionTarget(undefined)
    queueMicrotask(() => {
        for (const n of node)
            n && removeBaseNode(n)
            
        refreshGameEditorSelection()
    })
}