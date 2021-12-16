import { push } from "@lincode/react-global-state"
import autoResetStore from "./utils/autoResetStore"

export const [useCodeSteps, setCodeSteps, getCodeSteps] = autoResetStore<Array<string> | undefined>(undefined)
export const pushCodeSteps = push(setCodeSteps, getCodeSteps)