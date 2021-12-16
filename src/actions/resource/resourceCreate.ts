import { validateSanitization } from "@pinyinma/validators"
import queryResourceCreate from "../../queries/queryResourceCreate"
import { setDialog } from "@pinyinma/dialog"
import fileDialog from "../utils/fileDialog"

export default () => new Promise<void>(resolve => {
    fileDialog(title => {
        setDialog({
            message: "标签",
            validator: validateSanitization,
            prompt: true,
            chips: true,
            onConfirm: async tags => {
                await queryResourceCreate({ title, type: "model", tags: tags as any })
                resolve()
            }
        })
    })
})