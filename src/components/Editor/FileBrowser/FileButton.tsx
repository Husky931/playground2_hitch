import React, { useMemo } from "react"
//@ts-ignore
import folderUpSrc from "./assets/folder-up.png"
//@ts-ignore
import folderSrc from "./assets/folder.png"
//@ts-ignore
import fileSrc from "./assets/file.png"
import { DirTree } from "@pinyinma/datatypes"
import fileOpen from "../../../actions/file/fileOpen"
import { setFileBrowserDrag } from "../../../state/useFileBrowserDrag"
import ImageIcon from "@mui/icons-material/ImageOutlined"
import AudiotrackIcon from "@mui/icons-material/AudiotrackOutlined"
import LayersIcon from "@mui/icons-material/LayersOutlined"
import CodeIcon from "@mui/icons-material/CodeOutlined"
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined"
import { getExtensionType } from "@pinyinma/validators"
import { useDirSelected } from "../../../state/useDirSelected"

interface FileButtonProps {
    type: "folderUp" | "folder" | "file"
    target: DirTree | string
}

const Icon: React.FC<{ Component: any }> = ({ Component }) => {
    if (!Component) return null

    return (
        <Component className="center text-black opacity-25" />
    )
}

const FileButton: React.FC<FileButtonProps> = ({ type, target, children }) => {
    const iconSrc = type === "folderUp" ? folderUpSrc : type === "folder" ? folderSrc : fileSrc
    const [dirSelected, setDirSelected] = useDirSelected()
    
    const IconComponent = useMemo(() => {
        const fileType = (type === "file" && typeof target === "string") ? getExtensionType(target) : undefined
        if (!fileType) return

        if (fileType === "audio")
            return AudiotrackIcon
        if (fileType === "image")
            return ImageIcon
        if (fileType === "model")
            return LayersIcon
        if (fileType === "plainText")
            return CodeIcon
        if (fileType === "scene")
            return AccountBalanceIcon
            
    }, [type, target])

    return(
        <div
         className="p-2 float-left overflow-hidden w-24 h-24 flex flex-col items-center"
         onDoubleClick={() => fileOpen(target)}
         onClick={e => (e.stopPropagation(), setDirSelected(target))}
         style={{ background: dirSelected === target ? "rgba(255, 255, 255, 0.1)" : "none" }}
         draggable
         onDragStart={() => setFileBrowserDrag(typeof target === "string" ? target : target["/"])}
         onDragEnd={() => setFileBrowserDrag(undefined)}
        >
            <div style={{ height: "calc(100% - 1.75rem)" }}>
                <img className="pointer-events-none h-full" src={iconSrc} />
                <Icon Component={IconComponent} />
            </div>
            <div className="leading-tight break-all">
                {children}
            </div>
        </div>
    )
}

export default FileButton