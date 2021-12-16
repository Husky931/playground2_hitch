import store, { createEffect } from "@lincode/react-global-state"
import { getAssistantHighlight } from "./useAssistantHighlight"
import { getAssistantOpen } from "./useAssistantOpen"

const [useAssistantHighlightTarget, setAssistantHighlightTarget, getAssistantHighlightTarget] = store<Element | null>(null)
export { useAssistantHighlightTarget, getAssistantHighlightTarget }

createEffect(() => {
    const highlight = getAssistantHighlight()
    const open = getAssistantOpen()

    if (!highlight) {
        setAssistantHighlightTarget(null)
        return
    }
    if (!open) return

    const el = document.querySelector(highlight.selector)
    setAssistantHighlightTarget(el)

    if (!el) return

    const interval = setInterval(() => {
        if (document.querySelector(highlight.selector)) return
        setAssistantHighlightTarget(null)
        clearInterval(interval)
    }, 1000)

    return () => {
        clearInterval(interval)
    }
}, [getAssistantHighlight, getAssistantOpen])