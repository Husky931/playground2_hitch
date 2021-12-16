import { useWindowSize } from "@lincode/hooks"
import { AppBar, Button, Toolbar } from "@mui/material"
import { Border } from "@pinyinma/components"
import React from "react"
import { useFileBrowserHeight } from "../../../state/useFileBrowserHeight"
import LibraryList from "./LibraryList"
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft"
import { useLibraryPanelVisible } from "../../../state/useLibraryPanelVisible"
import { useTheme } from "@pinyinma/playground-theme"

interface LibraryPanelProps {
    style: React.CSSProperties
}

const LibraryPanel: React.FC<LibraryPanelProps> = ({ style }) => {
    const [visible, setVisible] = useLibraryPanelVisible()
    const [fileBrowserHeight] = useFileBrowserHeight()
    const [, windowHeight] = useWindowSize()
    const height = windowHeight - fileBrowserHeight
    const [theme] = useTheme()

    return (
        <div className="flex flex-col" style={{ ...style, width: visible ? 200 : 0 }}>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar variant="dense">
                    <div>元素库</div>
                </Toolbar>
                <Border horizontal />
            </AppBar>
            <div className="flex-grow overflow-y-scroll opacity-75">
                <LibraryList />
            </div>
            <Border />
            <div className="absolute left-0 top-0 w-0 z-10" style={{ height }}>
                <div className="w-4 h-12 center overflow-hidden rounded border border-white border-opacity-25" style={{
                    background: theme.customPalette.background.darker0
                }}>
                    <Button
                     className="center w-full h-full bg-transparent"
                     disableElevation
                     variant="contained"
                     onClick={() => setVisible(!visible)}
                    >
                        <ArrowLeftIcon fontSize="small" style={{ transform: `rotate(${visible ? "180deg" : "0deg"})` }} />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default LibraryPanel