import { DirTree } from "@pinyinma/datatypes"
import { setDir } from "../../state/useDir"
import { getExtensionType } from "@pinyinma/validators"
import { setImageViewer } from "@pinyinma/image-viewer"
import { setDialog } from "@pinyinma/dialog"
import { setGameEditor } from "../../state/useGameEditor"
import { getDirTree } from "../../state/useDirTree"
import { getAbsoluteURI } from "../../utils/uriGetters"
import { setModelViewer } from "../../state/useModelViewer"
import { setCodeTab } from "../../state/useCodeTab"
import { setGameEditorTab } from "../../state/useGameEditorTab"
import { baseURL } from "../../utils/http"

const fileOpen = (target: string | DirTree) => {
    if (typeof target === "object") {
        setDir([target])
        return
    }
    const fileType = getExtensionType(target)
    
    if (fileType === "plainText") {
        setCodeTab(target)
        return
    }
    if (fileType === "image") {
        setImageViewer({ src: baseURL + target })
        return
    }
    if (fileType === "scene") {
        setGameEditor(true)
        setGameEditorTab(target)
        return
    }
    if (fileType === "model") {
        setModelViewer({ src: target })
        return
    }
    setDialog({ message: "不支持打开此类文件" })
}
export default fileOpen

getDirTree(dirTree => dirTree && fileOpen(getAbsoluteURI("app.ls")))