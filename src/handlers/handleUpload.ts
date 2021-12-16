import folderUpload from "../actions/file/folderUpload"
import fileUpload from "../actions/file/fileUpload"
import { setContextMenu } from "@pinyinma/context-menu"
import handleSearch from "./handleSearch"

export default () => {
    setContextMenu([
        { text: "在线搜索", onClick: handleSearch },
        { text: "上传文件", onClick: fileUpload },
        { text: "上传文件夹", onClick: folderUpload }
    ])
}