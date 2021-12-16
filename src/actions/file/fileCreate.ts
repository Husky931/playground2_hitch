import { getDir, setDir } from "../../state/useDir"
import fileOpen from "./fileOpen"
import dedent from "ts-dedent"
import fileDialog from "../utils/fileDialog"
import { normalizeFileNameString } from "../../utils/normalizeFileName"
import { getExtensionType } from "@pinyinma/validators"
import { graphql } from "../../utils/http"

export default (o?: { isDir?: boolean, extension?: string }) => {
    const [dir] = getDir()
    if (!dir) return

    const { isDir, extension } = o ?? {}

    fileDialog(async name => {
        !isDir && (name = normalizeFileNameString(name, extension ?? "ls"))

        if (name in dir)
            throw new Error("同名文件已经存在")

        const location = dir["/"] + "/" + name

        await graphql(dedent`
            mutation {
                projectFile(location: "${location}"${isDir ? "" : `, content: ""`}) {
                    recordId
                }
            }
        `)
        dir[name] = isDir ? { "/": location } : location
        setDir([dir])

        const fileType = getExtensionType(name)
        !isDir && (fileType === "plainText" || fileType === "scene") && fileOpen(location)
    })
}