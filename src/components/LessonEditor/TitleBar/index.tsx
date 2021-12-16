import { AppBar, Toolbar, Button } from "@mui/material"
import React from "react"
import CancelIcon from "@mui/icons-material/Cancel"
import { useLessonEditorHidden } from "../../../state/useLessonEditorHidden"

const TitleBar: React.FC<{ onClose: () => void, style: React.CSSProperties }> = ({ onClose, style }) => {
    const [hidden, setHidden] = useLessonEditorHidden()

    return (
        <AppBar position="relative" color="transparent" elevation={0} style={style}>
            <Toolbar variant="dense">
                <Button
                 className="mr-2"
                 variant="contained"
                 color="secondary"
                 size="small"
                 startIcon={<CancelIcon />}
                 onClick={onClose}
                >
                    关闭
                </Button>
                <Button
                 className="mr-2"
                 variant="contained"
                 color="secondary"
                 size="small"
                 startIcon={<CancelIcon />}
                 onClick={() => setHidden(!hidden)}
                >
                    {hidden ? "显示" : "隐藏"}
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default TitleBar