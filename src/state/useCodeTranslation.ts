import { Resolvable } from "@lincode/promiselikes"
import store from "@lincode/react-global-state"
import { emitNotification } from "../events/onNotification"

export const [useCodeTranslation, setCodeTranslation, getCodeTranslation] = store(false)

getCodeTranslation(translation => translation && emitNotification(["双语模式", "warning", {
    text: "退出",
    complete: new Resolvable(() => setCodeTranslation(false))
}]))