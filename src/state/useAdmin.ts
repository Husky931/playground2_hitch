import { Resolvable } from "@lincode/promiselikes"
import store from "@lincode/react-global-state"
import { emitNotification } from "../events/onNotification"

export const [useAdmin, setAdmin, getAdmin] = store(false)

getAdmin(admin => admin && emitNotification(["管理员模式", "warning", {
    text: "退出",
    complete: new Resolvable(() => setAdmin(false))
}]))