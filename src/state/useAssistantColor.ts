import autoResetStore from "./utils/autoResetStore"

export const [useAssistantColor, setAssistantColor] = autoResetStore<"primary" | "secondary">("primary")