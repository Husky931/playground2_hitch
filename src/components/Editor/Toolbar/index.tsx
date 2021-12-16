import React from "react"
import { IconButton } from "@mui/material"
import SyncIcon from "@mui/icons-material/Sync"
import UndoIcon from "@mui/icons-material/Undo"
import RedoIcon from "@mui/icons-material/Redo"
import SkipNextIcon from "@mui/icons-material/SkipNext"
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious"
import MessageIcon from "@mui/icons-material/Message"
import TextRotationDownIcon from "@mui/icons-material/TextRotationDown"
import ZoomInIcon from "@mui/icons-material/ZoomIn"
import ZoomOutIcon from "@mui/icons-material/ZoomOut"
import { controls } from "../CodeEditor/Code"
import { getCodeStep, setCodeStep } from "../../../state/useCodeStep"
import { getCodeSteps, useCodeSteps } from "../../../state/useCodeSteps"
import { useCodeStepsEdit } from "../../../state/useCodeStepsEdit"
import { newLine, redo, undo } from "../CodeEditor"
import lessonSteps from "../../../actions/lesson/lessonSteps"
import { Border } from "@pinyinma/components"
import Hamburger from "./Hamburger"
import SaveButton from "./SaveButton"
import { getCodeFontSize, setCodeFontSize } from "../../../state/useCodeFontSize"

const nextStep = () => setCodeStep(Math.min(getCodeStep() + 1, (getCodeSteps()?.length ?? 1) - 1))
const prevStep = () => setCodeStep(Math.max(getCodeStep() - 1, 0))

const handleZoomIn = () => setCodeFontSize(getCodeFontSize() + 1)
const handleZoomOut = () => setCodeFontSize(getCodeFontSize() - 1)

const Toolbar: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    const [codeSteps] = useCodeSteps()
    const [codeStepsEdit] = useCodeStepsEdit()

    return (
        <div className="flex flex-col px-2 w-16 text-center" style={style}>
            <div className="flex justify-center items-center" style={{ height: 48 }}>
                <Hamburger />
                <Border horizontal />
            </div>
            <div>
                <div className="my-2">
                    <IconButton className="lingo-toolbar-suggest" onClick={controls.suggest}>
                        <MessageIcon fontSize="small" />
                    </IconButton>
                    <IconButton className="lingo-toolbar-newline" onClick={newLine}>
                        <TextRotationDownIcon fontSize="small" />
                    </IconButton>
                </div>
                <Border horizontal />
            </div>
            <div>
                <div className="my-2">
                    <IconButton className="lingo-toolbar-undo" onClick={handleZoomIn}>
                        <ZoomInIcon />
                    </IconButton>
                    <IconButton className="lingo-toolbar-redo" onClick={handleZoomOut}>
                        <ZoomOutIcon />
                    </IconButton>
                </div>
                <Border horizontal />
            </div>
            <div>
                <div className="my-2">
                    <IconButton className="lingo-toolbar-undo" onClick={undo}>
                        <UndoIcon fontSize="small" />
                    </IconButton>
                    <IconButton className="lingo-toolbar-redo" onClick={redo}>
                        <RedoIcon fontSize="small" />
                    </IconButton>
                    <SaveButton />
                </div>
                <Border horizontal />
            </div>
            {codeSteps && (
                <div>
                    <div className="my-2">
                        <IconButton onClick={nextStep}>
                            <SkipNextIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={prevStep}>
                            <SkipPreviousIcon fontSize="small" />
                        </IconButton>
                        {codeStepsEdit && (
                            <IconButton onClick={lessonSteps}>
                                <SyncIcon fontSize="small" />
                            </IconButton>
                        )}
                    </div>
                    {/* <Border horizontal /> */}
                </div>
            )}
            <Border />
        </div>
    )
}

export default Toolbar