import { setDialog } from "@pinyinma/dialog"
import { getDir, setDir } from "../../state/useDir"
import { DirTree } from "@pinyinma/datatypes"
import { splitFileName } from "@lincode/utils"
import { getAbsoluteURI } from "../../utils/uriGetters"
import dedent from "ts-dedent"
import { emitFileRename } from "../../events/onFileRename"
import { emitDirRename } from "../../events/onDirRename"
import fileDialog from "../utils/fileDialog"
import { normalizeFileNameString } from "../../utils/normalizeFileName"
import { graphql } from "../../utils/http"

export default (target: string | DirTree) => {
    const [dir] = getDir()
    if (!dir) return

    const locationOld = typeof target === "object" ? target["/"] : target

    if (locationOld === getAbsoluteURI("app.ls")) {
        setDialog({ message: "不能重命名程序主文件" })
        return
    }

    fileDialog(async nameNew => {
        const nameOld = locationOld.split("/").pop()!
        const isDir = typeof target === "object"

        !isDir && (nameNew = normalizeFileNameString(nameNew, splitFileName(nameOld)[1] ?? "ls"))

        if (nameNew in dir)
            throw new Error("同名文件已经存在")

        const location = dir["/"] + "/" + nameNew

        await graphql(dedent`
            mutation {
                projectFile(location: "${locationOld}", locationNew: "${location}") {
                    recordId
                }
            }
        `)
        delete dir[nameOld]
        dir[nameNew] = isDir ? target : location
        typeof target === "object" && (target["/"] = location)
        setDir([dir])

        if (isDir)
            return emitDirRename([locationOld + "/", location + "/"])
        
        emitFileRename([locationOld, location])
    })
}