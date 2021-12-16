import autoResetStore from "./utils/autoResetStore"

export const [useCodeFontSize, setCodeFontSize, getCodeFontSize, resetCodeFontSize] = autoResetStore(13)