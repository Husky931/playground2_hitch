import { useFilesDrop } from "@lincode/hooks"
import { useImagePaste } from "@pinyinma/hooks"
import { handleImageDrop } from "@pinyinma/hooks/lib/useImageDrop"
import { getExtensionType } from "@pinyinma/validators"
import React from "react"
import fileDialog from "../../actions/utils/fileDialog"
import fileUpload from "../../actions/file/fileUpload"
import handleModelDrop from "../../handlers/handleModelDrop"
import { assignImageViewer, setImageViewer } from "@pinyinma/image-viewer"
import { assignModelViewer, setModelViewer } from "../../state/useModelViewer"
import { normalizeFileName } from "../../utils/normalizeFileName"
import { setDialog } from "@pinyinma/dialog"
import { useFileBrowserDrag } from "../../state/useFileBrowserDrag"
import handleFolderDrop from "../../handlers/handleFolderDrop"
import { getProject } from "../../state/useProject"

const handleFilesDrop = (e: DragEvent, fileData: Array<{ fullPath: string, file: File }>) => {
    if (fileData.length === 0)
        e.dataTransfer && handleImageDrop(e.dataTransfer.items, blob => {
            if (!blob) {
                setDialog({ message: "当前图片不支持拖拽，请下载本地后再上传" })
                return
            }
            setImageViewer({
                src: blob,
                onSave: getProject() && (() => fileDialog(async name => {
                    await fileUpload(normalizeFileName(blob, name, "png"))
                    assignImageViewer({ onSave: undefined })
                }))
            })
        })
    else if (fileData.length === 1) {
        const fileType = getExtensionType(fileData[0].fullPath)
        
        if (fileType === "image")
            setImageViewer({
                src: fileData[0].file,
                onSave: getProject() && (() => fileDialog(async name => {
                    await fileUpload(normalizeFileName(fileData[0].file, name, "png"))
                    assignImageViewer({ onSave: undefined })
                }))
            })
        else if (fileType === "model") {
            setModelViewer({
                src: fileData[0].file,
                onSave: getProject() && (() => fileDialog(async name => {
                    await fileUpload(normalizeFileName(fileData[0].file, name, "glb"))
                    assignModelViewer({ onSave: undefined })
                }))
            })
        }
    }
    else if (fileData.length > 1)
        if (fileData.some(fd => fd.file.name.endsWith("gltf")))
            handleModelDrop(fileData)
        else
            handleFolderDrop(fileData)
}

const handleImagePaste = (blob?: Blob) => {
    if (!blob) {
        setDialog({ message: "当前图片不支持粘贴，请下载本地后再上传" })
        return
    }
    setImageViewer({
        src: blob,
        onSave: getProject() && (() => fileDialog(async name => {
            await fileUpload(normalizeFileName(blob, name, "png"))
            assignImageViewer({ onSave: undefined })
        }))
    })
}

interface DropZoneProps {
    className?: string
    style?: React.CSSProperties
}

const DropZone: React.FC<DropZoneProps> = ({ className, style, children }) => {
    const [fileBrowserDrag] = useFileBrowserDrag()

    const [setDropEl, dragOver] = useFilesDrop(handleFilesDrop, !!fileBrowserDrag)
    useImagePaste(handleImagePaste)

    return (
        <div className={className} style={style} ref={setDropEl}>
            {children}
            {dragOver && (
                <div className="absfull bg-black bg-opacity-50 text-white flex items-center justify-center z-10">
                    上传文件
                </div>
            )}
        </div>
    )
}

export default DropZone