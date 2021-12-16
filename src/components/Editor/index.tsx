import React, { useEffect } from "react"
import Toolbar from "./Toolbar"
import CodeEditor from "./CodeEditor"
import { useTheme } from "@pinyinma/playground-theme"
import Preview from "./Preview"
import FileBrowser from "./FileBrowser"
import dedent from "ts-dedent"
import DropZone from "../DropZone"
import fileCreate from "../../actions/file/fileCreate"
import GameEditor from "../GameEditor"
import LessonEditor from "../LessonEditor"
import MarkdownEditor from "../MarkdownEditor"
import { useCodeTranslation } from "../../state/useCodeTranslation"
import LibraryPanel from "./LibraryPanel"
import CommandBox from "../CommandBox"
import { setCommandBox, getCommandBox } from "../../state/useCommandBox"

const newMenu = [
    { text: "新建文件", onClick: fileCreate, className: "lingo-fileCreate" },
    { text: "新建3D场景", onClick: () => fileCreate({ extension: "l3d" }) },
    { text: "新建文件夹", onClick: () => fileCreate({ isDir: true }) }
]

const Editor: React.FC = () => {
    const [{ customPalette: { background } }] = useTheme()
    const [translation] = useCodeTranslation()

    useEffect(() => {
        const cb = (e: KeyboardEvent) => {
            if (!e.metaKey && !e.ctrlKey) return
            const key = e.key.toLowerCase()
            ;(key === "p" || key === "k") && setCommandBox(!getCommandBox())
        }
        document.addEventListener("keydown", cb)

        return () => {
            document.removeEventListener("keydown", cb)
        }
    }, [])

    return (
        <>
            <DropZone className="absfull text-white grid" style={{
                background: background.default,
                gridTemplateAreas: dedent`
                    "toolbar code  panel preview"
                    "toolbar files panel preview"
                `,
                gridTemplateColumns: `auto minmax(0, ${translation ? "3fr" : "1.5fr"}) auto minmax(0, 1fr)`,
                gridTemplateRows: "minmax(0, 1fr) auto"
            }}>
                <Toolbar style={{ gridArea: "toolbar", background: background.lighter0 }} />
                <CodeEditor style={{ gridArea: "code", background: background.default }} />
                <FileBrowser style={{ gridArea: "files", background: background.default }} newMenu={newMenu} />
                <Preview style={{ gridArea: "preview", background: background.darker1 }} />
                <LibraryPanel style={{ gridArea: "panel", background: background.darker0 }} />
            </DropZone>
            <LessonEditor />
            <GameEditor />
            <MarkdownEditor />
            <CommandBox />
        </>
    )
}

export default Editor