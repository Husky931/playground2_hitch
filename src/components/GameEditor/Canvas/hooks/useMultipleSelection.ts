import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import { useEffect } from "react"
import { assignFileUnsaved } from "../../../../state/useFileUnsaved"
import { BaseNode, userUpdateBaseNodes } from "../../../../state/useGameEditorGraph"
import { useGameEditorSelectionTarget } from "../../../../state/useGameEditorSelectionTarget"
import { getGameEditorTab } from "../../../../state/useGameEditorTab"
import { pickTransformRecord } from "./useTransformControls"

const multipleSelectionTransformMap = new Map<SimpleObjectManager, BaseNode>()

export const queueMultipleSelectionTransform = (node: BaseNode, t: SimpleObjectManager) => {
    multipleSelectionTransformMap.set(t, node)
    const tab = getGameEditorTab()
    tab && assignFileUnsaved({ [tab]: true })
}

export const flushMultipleSelectionTransform = () => {
    const transforms = [...multipleSelectionTransformMap]
    multipleSelectionTransformMap.clear()

    userUpdateBaseNodes(() => transforms.map(([t, node]) => [node, pickTransformRecord(t)]))
}

export default () => {
    const [{ nodes }] = useGameEditorSelectionTarget()

    useEffect(() => {
        !nodes.length && flushMultipleSelectionTransform()
    }, [nodes])
}