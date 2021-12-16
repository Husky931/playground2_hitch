import fileDialog from "@lincode/file-dialog"
import dedent from "ts-dedent"
import { getDir, setDir } from "../../state/useDir"
import { setDialog } from "@pinyinma/dialog"
import { set } from "@lincode/utils"
import b2mb from "../../utils/b2mb"
import { graphqlUpload } from "../../utils/http"

export default async (files?: Array<File> | FileList) => {
    const [dir] = getDir()
    if (!dir) return

    files ??= await fileDialog({ directory: true })

    const testFile = files[0]
    if (!("webkitRelativePath" in testFile)) {
        setDialog({ message: "当前浏览器不支持上传文件夹" })
        return
    }
    const folderName = testFile.webkitRelativePath.split("/")[0]
    if (!folderName) {
        setDialog({ message: "不能上传当前文件夹" })
        return
    }

    if (folderName in dir)
        throw new Error("同名文件夹已经存在")

    let totalSize = 0
    for (const file of files)
        totalSize += b2mb(file.size)
        
    if (totalSize > 100) {
        setDialog({ message: "文件总体积大于100mb，暂时不支持上传" })
        return
    }

    for (const file of files) {
        if (file.name === ".DS_Store") continue

        const location = dir["/"] + "/" + (file as any).webkitRelativePath

        await graphqlUpload(file, dedent`
            mutation ($file: Upload!) {
                projectFile(location: "${location}", file: $file) {
                    recordId
                }
            }
        `)
        set(dir, (file as any).webkitRelativePath.split("/"), location)
    }
    setDir([dir])
}