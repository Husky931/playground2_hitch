import { createEffect } from "@lincode/react-global-state"
import autoResetStore from "./utils/autoResetStore"
import { getAssistantGraph } from "./useAssistantGraph"
import { getAssistantGraphId } from "./useAssistantGraphId"

export const [useAssistantGraphHistory, setAssistantGraphHistory, getAssistantGraphHistory] = autoResetStore<Array<string>>([])

getAssistantGraph(() => setAssistantGraphHistory([]))

createEffect(() => {
    const graph = getAssistantGraph()
    const id = getAssistantGraphId()

    if (!graph || !id) return

    const current = getAssistantGraphHistory()
    const index = current.indexOf(id)
    setAssistantGraphHistory(index !== -1 ? current.slice(0, index + 1) : [...current, id])

}, [getAssistantGraph, getAssistantGraphId])