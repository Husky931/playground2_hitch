import { IconButton, Badge } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import React from "react"
import { getLegacy } from "../../../state/useLegacy"
import { setContextMenu } from "@pinyinma/context-menu"
import { languageWorkerCompile } from "../CodeEditor/lingoscript/languageWorker"
import { getAbsoluteURI, getProjectRootURI } from "../../../utils/uriGetters"
import fileUpdate from "../../../actions/file/fileUpdate"
import { setImageViewer } from "@pinyinma/image-viewer"
import { setDialog } from "@pinyinma/dialog"
import { getProject } from "../../../state/useProject"
import fileOpen from "../../../actions/file/fileOpen"
import { log } from "@lincode/utils"
import { getEntryCode } from "../../../state/useEntryCode"
import { controls } from "../CodeEditor/Code"
import queryProjectUpdate from "../../../queries/queryProjectUpdate"
import lessonReset from "../../../actions/lesson/lessonReset"
import { getLessons } from "../../../state/useLessons"
import { baseURL } from "../../../utils/http"

const Hamburger: React.FC = React.memo(() => {
    const isLegacy = getLegacy() !== "latest"

    const handleHamburger = () => setContextMenu([
        {
            text: "导出二维码",
            onClick: async () => {
                await controls.saveAll()
                fileOpen(getAbsoluteURI("app.ls"))
    
                const code = getEntryCode()
                const [compiled] = await languageWorkerCompile(getAbsoluteURI("app.ls"), code)
    
                await fileUpdate(getAbsoluteURI("dist.js"), compiled)
    
                const src = log(baseURL + getProjectRootURI())
                setImageViewer({ src, qr: true })
            }
        },
        {
            text: "返回主屏幕",
            onClick: () => setDialog({
                message: "确定要返回主屏幕吗？",
                onConfirm: async () => {
                    // setProject(undefined)
                    location.reload()
                }
            })
        },
        ...(isLegacy ? [
            {
                text: "升级此项目",
                onClick: () => setDialog({
                    message: "将项目升级到平台最新版本可能会造成代码错误！确定要继续吗？",
                    onConfirm: async () => {
                        await queryProjectUpdate(getProject()!, { platformVersion: "2.0.0" })
                        location.reload()
                    }
                })
            },
            {
                text: "重置此课程",
                onClick: () => setDialog({
                    message: "重置课程会导致代码被清空！确定要继续吗？",
                    onConfirm: async () => {
                        const lessonId = getProject()?.lesson
                        const lesson = lessonId && getLessons().find(l => l._id === lessonId)
                        lesson && await lessonReset(lesson)
                        location.reload()
                    }
                })
            }
        ] : [])
    ])

    return (
        <IconButton className="lingo-toolbar-menu" onClick={handleHamburger}>
            <Badge badgeContent={isLegacy ? "!" : undefined} color="error">
                <MenuIcon fontSize="small" />
            </Badge>
        </IconButton>
    )
})

export default Hamburger