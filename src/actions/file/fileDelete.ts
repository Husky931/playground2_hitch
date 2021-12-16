import { setDialog } from "@pinyinma/dialog"
import { DirTree } from "@pinyinma/datatypes"
import { getDir, setDir } from "../../state/useDir"
import { getAbsoluteURI } from "../../utils/uriGetters"
import dedent from "ts-dedent"
import { emitFileDelete } from "../../events/onFileDelete"
import { emitDirDelete } from "../../events/onDirDelete"
import { graphql } from "../../utils/http"

const truncate = (text: string, length = 20) => text.length > length ? (text.slice(0, length) + "...") : text

export default (target: string | DirTree) => {
    const [dir] = getDir()
    if (!dir) return

    const targetLocation = typeof target === "object" ? target["/"] : target

    if (targetLocation === getAbsoluteURI("app.ls")) {
        setDialog({ message: "不能删除程序主文件" })
        return
    }

    const name = targetLocation.split("/").pop()!
    const nameTruncated = truncate(name)

    setDialog({
        message: `确定要删除“${nameTruncated}”吗？`,
        onConfirm: async () => {
            await graphql(dedent`
                mutation {
                    projectFile(location: "${targetLocation}", delete: true) {
                        recordId
                    }
                }
            `)
            delete dir[name]
            setDir([dir])

            if (typeof target === "object")
                return emitDirDelete(targetLocation + "/")
            
            emitFileDelete(targetLocation)
        }
    })
}