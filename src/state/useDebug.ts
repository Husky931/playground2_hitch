import { Resolvable } from "@lincode/promiselikes"
import store from "@lincode/react-global-state"
import { emitNotification } from "../events/onNotification"

export const [, setDebug, getDebug] = store(false)

getDebug(debug => debug && emitNotification(["Debug 模式", "warning", {
    text: "退出",
    complete: new Resolvable(() => setDebug(false))
}]))