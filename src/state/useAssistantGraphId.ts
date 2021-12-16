import autoResetStore from "./utils/autoResetStore"

export const [useAssistantGraphId, setAssistantGraphId, getAssistantGraphId] = autoResetStore<string | undefined>(undefined)