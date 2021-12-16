import autoResetStore from "./utils/autoResetStore"

export const [, setFocus, getFocus] = autoResetStore<string | undefined>(undefined)