import store, { createEffect } from "@lincode/react-global-state"
import { getAbsoluteURI } from "../utils/uriGetters"
import { getCodeSteps } from "./useCodeSteps"
import { getCodeTab } from "./useCodeTab"

const [useCodeStepsRender, setCodeStepsRender, getCodeStepsRender] = store(false)
export { useCodeStepsRender, getCodeStepsRender }

createEffect(() => {
    const codeTab = getCodeTab()
    const codeSteps = getCodeSteps()
    setCodeStepsRender(!!codeSteps && codeTab === getAbsoluteURI("app.ls"))

}, [getCodeTab, getCodeSteps])