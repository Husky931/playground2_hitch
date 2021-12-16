import autoResetStore from "./utils/autoResetStore"

export const [useCodeTyping, setCodeTyping, getCodeTyping] = autoResetStore(false)