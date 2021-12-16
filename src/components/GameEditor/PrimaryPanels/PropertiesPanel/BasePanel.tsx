import { forceGet } from "@lincode/utils"
import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import React, { useLayoutEffect, useRef } from "react"
import { Pane } from "tweakpane"
import { onGameEditorTransformControls } from "../../../../events/onGameEditorTransformControls"
import { BaseNode, userUpdateBaseNode } from "../../../../state/useGameEditorGraph"
import toFixed from "../../../../utils/toFixed"
import { nodeInstanceMap } from "../../Canvas/GameComponent"
import { queueMultipleSelectionTransform } from "../../Canvas/hooks/useMultipleSelection"
import { timelineState } from "../../Timeline/TimelineComponent"
import isMultipleSelectionGroup from "../../utils/isMultipleSelectionGroup"
import { displayFolder, propertiesFolder, transformFolder } from "./folderNames"
import makeValue from "./makeValue"
import "./tweakpane.css"

let programmaticChange = false

const makeVectorValue = (
    t: SimpleObjectManager, nodes: Array<BaseNode | undefined>, xName: string, yName: string, zName: string
) => {
    //@ts-ignore
    return [{ x: toFixed(t[xName]), y: toFixed(t[yName]), z: toFixed(t[zName]) }, {
        folder: transformFolder,
        onChange: ({ last, value: { x, y, z } }: any) => {
            if (programmaticChange) return

            Object.assign(t, { [xName]: x, [yName]: y, [zName]: z })
            
            if (!last) return

            if (isMultipleSelectionGroup(t))
                for (const node of nodes) {
                    const t = node && nodeInstanceMap.get(node)
                    t && queueMultipleSelectionTransform(node, t)
                }
            else {
                const [node] = nodes
                node && userUpdateBaseNode(node, { [xName]: x, [yName]: y, [zName]: z })
            }
        }
    }] as const
}

type Config = Record<string, readonly [any, Record<string, any>?]>

interface BasePanelProps {
    config?: Config
    t: SimpleObjectManager
    nodes: Array<BaseNode | undefined>
}

const BasePanel: React.FC<BasePanelProps> = ({ config, t, nodes }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const conf: Config = {
            "名字 name": makeValue(t, nodes, "name", "", propertiesFolder),
            "位置 xyz": makeVectorValue(t, nodes, "x", "y", "z"),
            "宽高长 size": makeVectorValue(t, nodes, "width", "height", "depth"),
            "比例 scale": makeVectorValue(t, nodes, "scaleX", "scaleY", "scaleZ"),
            "旋转 rotate": makeVectorValue(t, nodes, "rotationX", "rotationY", "rotationZ"),
            "光晕 bloom": makeValue(t, nodes, "bloom", false, displayFolder)
        }
        config && Object.assign(conf, config)
        const valueStore = Object.fromEntries(Object.entries(conf).map(([key, [value]]) => [key, value]))
        
        const pane: any = new Pane({ container: containerRef.current! })
        const inputs: Array<{ dispose: () => void, refresh: () => void }> = []
        const folderMap = new Map<string, any>()

        for (const [key, [, options]] of Object.entries(conf)) {
            const { onChange, folder, ...o } = options ?? {}
            const parent = folder ? forceGet(folderMap, folder, () => pane.addFolder({ title: folder })) : pane
            const input = parent.addInput(valueStore, key, o)
            inputs.push(input)
            onChange && input.on("change", onChange)
        }

        const updateFields = () => {
            Object.assign(valueStore, {
                "位置 xyz": { x: t.x, y: t.y, z: t.z },
                "宽高长 size": { x: t.width, y: t.height, z: t.depth },
                "比例 scale": { x: t.scaleX, y: t.scaleY, z: t.scaleZ },
                "旋转 rotate": { x: t.rotationX, y: t.rotationY, z: t.rotationZ }
            })
            programmaticChange = true
            pane.refresh()
            programmaticChange = false
        }
        const handle0 = onGameEditorTransformControls(updateFields)
        const handle1 = timelineState.getFrame(updateFields)

        return () => {
            pane.dispose()
            for (const input of inputs)
                input.dispose()

            handle0.cancel()
            handle1.cancel()
        }
    }, [])

    return (
        <div className="w-full h-20 nofix" ref={containerRef} />
    )
}

export default BasePanel