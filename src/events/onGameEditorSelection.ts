import { event } from "@lincode/events"

export const [emitGameEditorSelection, onGameEditorSelection] = event<boolean>()

export const refreshGameEditorSelection = () => {
    emitGameEditorSelection(false)
    setTimeout(() => setTimeout(() => emitGameEditorSelection(true)))
}