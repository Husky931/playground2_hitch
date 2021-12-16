import React from "react"
import { Badge, IconButton } from "@mui/material"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import SaveIcon from "@mui/icons-material/Save"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ControlCameraIcon from "@mui/icons-material/ControlCamera"
import RotateLeftIcon from "@mui/icons-material/RotateLeft"
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap"
import { useGameEditorTool } from "../../../state/useGameEditorTool"
import { setGameEditor } from "../../../state/useGameEditor"
import { useGameEditorTab } from "../../../state/useGameEditorTab"
import { useFileUnsaved } from "../../../state/useFileUnsaved"
import { Border } from "@pinyinma/components"
import { handleGameEditorSave } from "../Canvas/hooks/useSave"

const Toolbar: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    const [tool, setTool] = useGameEditorTool()
    const [unsaved] = useFileUnsaved()
    const [tab] = useGameEditorTab()

    return (
        <div className="flex flex-col px-2 w-16 text-center" style={style}>
            <div className="flex justify-center items-center" style={{ height: 48 }}>
                <IconButton onClick={() => setGameEditor(false)}>
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Border horizontal />
            </div>
            <div className="my-2">
                <IconButton onClick={() => setTool("translate")} color={tool === "translate" ? "primary": "default"}>
                    <ControlCameraIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setTool("rotate")} color={tool === "rotate" ? "primary": "default"}>
                    <RotateLeftIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => setTool("scale")} color={tool === "scale" ? "primary": "default"}>
                    <ZoomOutMapIcon fontSize="small" />
                </IconButton>
                <Border horizontal />
            </div>
            <div className="my-2">
                {/* <IconButton>
                    <UndoIcon fontSize="small" />
                </IconButton>
                <IconButton>
                    <RedoIcon fontSize="small" />
                </IconButton> */}
                <IconButton onClick={handleGameEditorSave}>
                    <Badge badgeContent={tab && (tab in unsaved) ? 1 : 0} color="error">
                        <SaveIcon fontSize="small" />
                    </Badge>
                </IconButton>
            </div>
            <Border />
        </div>
    )
}

export default Toolbar