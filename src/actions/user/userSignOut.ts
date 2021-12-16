import { setDialog } from "@pinyinma/dialog"
import { setUser } from "../../state/useUser"

export default () => setDialog({
    message: "确定要退出登录吗？",
    onConfirm: () => setUser(undefined)
})