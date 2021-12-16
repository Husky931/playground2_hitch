import fileDialog from "../actions/utils/fileDialog"
import folderUpload from "../actions/file/folderUpload"
import { assignModelViewer, getModelViewer, setModelViewer } from "../state/useModelViewer"
import { getProject } from "../state/useProject"

export default (fileData: Array<{ fullPath: string, file: File }>) => {
    const files: Array<[string, File]> = []
    const gltfSrcs: Array<string> = []

    for (const { fullPath, file } of fileData) {
        const url = fullPath.split("/").slice(2).join("/")
        if (url === ".DS_Store") continue

        files.push([url, file])
        url.endsWith(".gltf") && gltfSrcs.push(url)
    }
    if (gltfSrcs.length !== 1 || gltfSrcs[0].includes("/"))
        return

    setModelViewer({
        src: files,
        onSave: getProject() && (() => fileDialog(async val => {
            const srcFiles = getModelViewer()?.src
            const result: Array<File> = []
            for (const [url, file] of Array.isArray(srcFiles) ? srcFiles : files) {
                Object.defineProperty(file, "webkitRelativePath", { value: val + "/" + url })
                result.push(file)
            }
            await folderUpload(result)
            assignModelViewer({ onSave: undefined })
        }))
    })
}