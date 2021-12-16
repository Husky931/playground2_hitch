import React from "react"
import { AppBar, Toolbar, Button } from "@mui/material"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import LaunchIcon from "@mui/icons-material/Launch"
import DeleteIcon from "@mui/icons-material/Delete"
import DownloadIcon from "@mui/icons-material/Download"
import TextFormatIcon from "@mui/icons-material/TextFormat"
import { ContextMenuOptions, setContextMenu } from "@pinyinma/context-menu"
import fileOpen from "../../../actions/file/fileOpen"
import fileDelete from "../../../actions/file/fileDelete"
import fileRename from "../../../actions/file/fileRename"
import handleUpload from "../../../handlers/handleUpload"
import { useDirSelected } from "../../../state/useDirSelected"
import { useDir } from "../../../state/useDir"
import JsFileDownloader from "js-file-downloader"
import { baseURL } from "../../../utils/http"

interface FileToolbarProps {
    newMenu: Array<ContextMenuOptions>
}

const FileToolbar: React.FC<FileToolbarProps> = ({ newMenu }) => {
    const [dirSelected] = useDirSelected()
    const [[dir]] = useDir()
    const disabled = !dirSelected || dirSelected === "/" || (
        dir && typeof dirSelected !== "string" && !dirSelected["/"].includes(dir["/"])
    )

    return(
        <AppBar position="relative" color="transparent" elevation={0}>
            <Toolbar variant="dense" className="text-white text-opacity-75">
                <Button
                 className="lingo-dirCreate mr-2"
                 variant="outlined"
                 color="inherit"
                 size="small"
                 onClick={e => (e.stopPropagation(), setContextMenu(newMenu))}
                 startIcon={<AddCircleIcon />}
                >
                    新建
                </Button>

                <Button
                 className="mr-2"
                 variant="outlined"
                 color="inherit"
                 size="small"
                 startIcon={<CloudUploadIcon />}
                 onClick={e => (e.stopPropagation(), handleUpload())}
                >
                    上传
                </Button>

                <Button
                 className="lingo-fileOpen mr-2"
                 variant="outlined"
                 color="inherit"
                 size="small"
                 disabled={!dirSelected}
                 onClick={e => (e.stopPropagation(), fileOpen(dirSelected))}
                 startIcon={<LaunchIcon />}
                >
                    打开
                </Button>

                <Button
                 className="mr-2"
                 variant="outlined"
                 color="inherit"
                 size="small"
                 disabled={disabled}
                 onClick={e => (e.stopPropagation(), fileDelete(dirSelected))}
                 startIcon={<DeleteIcon />}
                >
                    删除
                </Button>

                <Button
                 className="mr-2"
                 variant="outlined"
                 color="inherit"
                 size="small"
                 disabled={disabled}
                 onClick={e => (e.stopPropagation(), fileRename(dirSelected))}
                 startIcon={<TextFormatIcon />}
                >
                    重命名
                </Button>

                <Button
                 className="mr-2"
                 variant="outlined"
                 color="inherit"
                 size="small"
                 disabled={disabled || typeof dirSelected !== "string"}
                 onClick={e => {
                     e.stopPropagation()
                     typeof dirSelected === "string"
                        ? new JsFileDownloader({ url: baseURL + dirSelected })
                        : new JsFileDownloader({ url: baseURL + dirSelected["/"] })
                 }}
                 startIcon={<DownloadIcon />}
                >
                    下载
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default FileToolbar