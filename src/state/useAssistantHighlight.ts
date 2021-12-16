import { createEffect } from "@lincode/react-global-state"
import autoResetStore from "./utils/autoResetStore"
import { getAssistantDialog } from "./useAssistantDialog"
import { getAssistantGraphNode } from "./useAssistantGraphNode"

export type AssistantHighlight = {
    selector: string,
    clickable: boolean
}

export const [useAssistantHighlight, setAssistantHighlight, getAssistantHighlight] = autoResetStore<AssistantHighlight | undefined>(undefined)

createEffect(() => {
    const dialog = getAssistantDialog()
    const highlight = getAssistantHighlight()
    const node = getAssistantGraphNode()

    if (highlight) return

    if (node?.action?.previewCode)
        setAssistantHighlight({ selector: ".lingo-preview", clickable: true })
    else if (dialog.message.includes("```"))
        setAssistantHighlight({ selector: ".lingo-monaco", clickable: true })

}, [getAssistantDialog, getAssistantGraphNode, getAssistantHighlight])