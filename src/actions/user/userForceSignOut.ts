import { setDialog } from "@pinyinma/dialog"
import { setUser } from "../../state/useUser"

export default () => setDialog({
    message: "需要重新登录",
    onConfirm: () => {
        setUser(undefined)
        location.reload()
    }
})