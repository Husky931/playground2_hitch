import React from "react"
import dedent from "ts-dedent"
import Canvas from "./Canvas"
import PrimaryPanels from "./PrimaryPanels"
import FileBrowser from "../Editor/FileBrowser"
import { DirTree } from "@pinyinma/datatypes"
import { getExtensionType } from "@pinyinma/validators"
import Toolbar from "./Toolbar"
import { useTheme } from "@pinyinma/playground-theme"
import Tabs from "./Tabs"
import { useGameEditorTab } from "../../state/useGameEditorTab"
import fileCreate from "../../actions/file/fileCreate"
import SecondaryPanels from "./SecondaryPanels"
import { Border } from "@pinyinma/components"
import Timeline from "./Timeline"
import DropZone from "../DropZone"
import { useFileBrowserHeight } from "../../state/useFileBrowserHeight"

const filter = ([key, value]: [string, string | DirTree]) => {
    if (typeof value === "object")
        return true

    const fileType = getExtensionType(key)

    if (fileType === "model" || fileType === "image" || fileType === "scene")
        return true

    return false
}

const newMenu = [
    { text: "新建3D场景", onClick: () => fileCreate({ extension: "l3d" }) },
    { text: "新建文件夹", onClick: () => fileCreate({ isDir: true }) }
]

const GameEditor: React.FC = () => {
    const [{ customPalette: { background } }] = useTheme()
    const [tab] = useGameEditorTab()
    const [height] = useFileBrowserHeight()

    return (
        <DropZone className="grid absfull" style={{
            gridTemplateAreas: dedent`
                "toolbar tabs     secondary primary"
                "toolbar stage    secondary primary"
                "toolbar files    secondary primary"
                "toolbar timeline timeline  timeline"
            `,
            gridTemplateColumns: `auto minmax(0, 1fr) auto auto`,
            gridTemplateRows: `auto minmax(0, 1fr) auto auto`
        }}>
            <Toolbar style={{ gridArea: "toolbar", background: background.lighter0 }} />
            <Tabs delay={500} style={{ gridArea: "tabs", background: background.default }} />
            {tab ? (
                <Canvas key={tab} style={{ gridArea: "stage", background: background.default }} />
            ) : (
                <div style={{ gridArea: "stage", background: background.default }}>
                    <Border horizontal />
                </div>
            )}
            <FileBrowser style={{ gridArea: "files", background: background.default }} filter={filter} newMenu={newMenu} />
            {/* <Timeline style={{ gridArea: "timeline", background: background.darker0, height }} /> */}
            <SecondaryPanels style={{ gridArea: "secondary", background: background.darker0 }} />
            <PrimaryPanels style={{ gridArea: "primary", background: background.darker1 }} />
        </DropZone>
    )
}

export default GameEditor