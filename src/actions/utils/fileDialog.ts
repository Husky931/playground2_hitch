import { setDialog } from "@pinyinma/dialog"
import { validateFileName } from "@pinyinma/validators"

export default (onConfirm: (name: string) => void | Promise<void> | undefined) => setDialog({
    message: "文件名",
    prompt: true,
    validator: validateFileName,
    onConfirm
})