import { debounce, omitDeep } from "@lincode/utils"
import { useEffect } from "react"
import fileUpdate from "../../../../actions/file/fileUpdate"
import { emitGameEditorSave, onGameEditorSave } from "../../../../events/onGameEditorSave"
import { emitGameEditorSelectionTarget } from "../../../../events/onGameEditorSelectionTarget"
import { getFileUnsaved, omitFileUnsaved } from "../../../../state/useFileUnsaved"
import { getGameEditorGraph, baseNodeUnsavedProperties } from "../../../../state/useGameEditorGraph"
import { getGameEditorTab } from "../../../../state/useGameEditorTab"

export const handleGameEditorSave = () => {
    emitGameEditorSelectionTarget(undefined)
    setTimeout(emitGameEditorSave)
}

export default () => {
    useEffect(() => {
        const handle = onGameEditorSave(debounce(() => {
            const uri = getGameEditorTab()
        
            if (uri && uri in getFileUnsaved()) {
                const { baseNodes, animationNodes } = getGameEditorGraph()
                const data = JSON.stringify([
                    ...animationNodes,
                    ...omitDeep(baseNodes, baseNodeUnsavedProperties)
                ])
                omitFileUnsaved(uri)
                fileUpdate(uri, data)
            }
        }, 500, "leading"))

        return () => {
            handle.cancel()
        }
    }, [])
}