import store, { createEffect } from "@lincode/react-global-state"
import { getAssistantHighlightTarget } from "./useAssistantHighlightTarget"
import { getAssistantOpen } from "./useAssistantOpen"

const [useAssistantHighlightBounds, setAssistantHighlightBounds] = store<DOMRect | undefined>(undefined)
export { useAssistantHighlightBounds }

createEffect(() => {
    const target = getAssistantHighlightTarget()
    const open = getAssistantOpen()

    if (target && open) {
        const setBounds = () => setAssistantHighlightBounds(target.getBoundingClientRect())
        setBounds()
        window.addEventListener("resize", setBounds)

        return () => {
            window.removeEventListener("resize", setBounds)
        }
    }
    setAssistantHighlightBounds(undefined)

}, [getAssistantHighlightTarget, getAssistantOpen])