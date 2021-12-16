import { validateProjectTitle } from "@pinyinma/validators"
import { setDialog } from "@pinyinma/dialog"

export default (onConfirm: (name: string) => void | Promise<void> | undefined) => setDialog({
    message: "项目名称",
    prompt: true,
    validator: validateProjectTitle,
    onConfirm
})