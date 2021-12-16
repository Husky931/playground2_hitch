import fileDialog from "@lincode/file-dialog"
import dedent from "ts-dedent"
import { getDir, setDir } from "../../state/useDir"
import { splitFileName } from "@lincode/utils"
import b2mb from "../../utils/b2mb"
import { setDialog } from "@pinyinma/dialog"
import { graphqlUpload } from "../../utils/http"

export default async (files?: File | Array<File> | FileList) => {
    const [dir] = getDir()
    if (!dir) return

    if (!files) files = await fileDialog({ multiple: true })
    if (files instanceof File) files = [files]

    let totalSize = 0
    for (const file of files)
        totalSize += b2mb(file.size)
        
    if (totalSize > 100) {
        setDialog({ message: "文件总体积大于100mb，暂时不支持上传" })
        return
    }

    for (const file of files) {
        let { name } = file
        
        let count = 1
        const nameParts = splitFileName(name)
        while (name in dir)
            name = `${nameParts[0]} ${++count}${nameParts[1] ? `.${nameParts[1]}` : ""}`

        const location = dir["/"] + "/" + name

        await graphqlUpload(file, dedent`
            mutation ($file: Upload!) {
                projectFile(location: "${location}", file: $file) {
                    recordId
                }
            }
        `)
        dir[name] = location
    }
    setDir([dir])
}