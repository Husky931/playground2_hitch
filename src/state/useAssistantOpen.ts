import autoResetStore from "./utils/autoResetStore"

export const [useAssistantOpen, setAssistantOpen, getAssistantOpen] = autoResetStore(false)