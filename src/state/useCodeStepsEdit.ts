import autoResetStore from "./utils/autoResetStore"

export const [useCodeStepsEdit, setCodeStepsEdit, getCodeStepsEdit] = autoResetStore(false)