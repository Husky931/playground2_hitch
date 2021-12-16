import { last } from "@lincode/utils"
import { AppBar, Toolbar, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import React from "react"
import { useAssistantGraphHistory } from "../../../../../state/useAssistantGraphHistory"
import { setAssistantGraphId } from "../../../../../state/useAssistantGraphId"
import { setAssistantOpen } from "../../../../../state/useAssistantOpen"

const DialogToolbar: React.FC = () => {
    const [graphHistory] = useAssistantGraphHistory()
    const prevId = last(graphHistory, -2)

    return (
        <AppBar position="relative" elevation={0} className="bg-black bg-opacity-25">
            <Toolbar variant="dense" className="opacity-75">
                <Button
                 startIcon={<ArrowBackIcon />}
                 color="inherit"
                 size="small"
                 disabled={!prevId}
                 onClick={() => setAssistantGraphId(prevId)}
                >
                    <span className="text-xs">上一步</span>
                </Button>
                <div className="flex-grow" />
                <Button color="inherit" size="small" onClick={() => setAssistantOpen(false)}>
                    <span className="text-xs">关闭</span>
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default DialogToolbar