import autoResetStore from "./utils/autoResetStore"

export const [useCodeStep, setCodeStep, getCodeStep] = autoResetStore(0)