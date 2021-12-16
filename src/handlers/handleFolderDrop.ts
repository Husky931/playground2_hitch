import { getExtensionType } from "@pinyinma/validators"
import folderUpload from "../actions/file/folderUpload"
import fileDialog from "../actions/utils/fileDialog"
import { assignImageGallery, getImageGallery, setImageGallery } from "../state/useImageGallery"
import { getProject } from "../state/useProject"

export default (fileData: Array<{ fullPath: string, file: File }>) => {
    const files: Array<[string, File]> = []

    for (const { fullPath, file } of fileData) {
        const url = fullPath.split("/").slice(2).join("/")
        getExtensionType(url) === "image" && files.push([url, file])
    }

    setImageGallery({
        src: files,
        onSave: getProject() && (() => fileDialog(async val => {
            const srcFiles = getImageGallery()?.src
            const result: Array<File> = []
            for (const [url, file] of Array.isArray(srcFiles) ? srcFiles : files) {
                Object.defineProperty(file, "webkitRelativePath", { value: val + "/" + url })
                result.push(file)
            }
            await folderUpload(result)
            assignImageGallery({ onSave: undefined })
        }))
    })
}