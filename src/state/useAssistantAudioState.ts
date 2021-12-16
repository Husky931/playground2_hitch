import autoResetStore from "./utils/autoResetStore"

export const [useAssistantAudioState] = autoResetStore<"wait" | "playing" | "stopped">("wait")