import React from "react"
import { AppBar, Toolbar, Chip, Avatar, Button } from "@mui/material"
import DoneIcon from "@mui/icons-material/Done"
import { useTheme } from "@pinyinma/playground-theme"
import { useConsoleVisible } from "../../../../state/useConsoleVisible"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"

const ConsoleToolbar: React.FC<{ numErrors: number }> = ({ numErrors }) => {
    const [theme] = useTheme()
    const [consoleVisible, setConsoleVisible] = useConsoleVisible()

    return (
        <AppBar position="relative" color="transparent" elevation={0}>
            <Toolbar variant="dense">
                <Chip
                 label={numErrors === 0 ? "代码没有错误" : "个代码错误"}
                 size="small"
                 clickable
                 icon={numErrors === 0 ? <DoneIcon /> : undefined}
                 avatar={numErrors > 0 ? <Avatar className="bg-red-900">{numErrors}</Avatar> : undefined}
                 style={{ background: numErrors === 0 ? "rgba(255,255,255,0.1)" : theme.palette.error.dark }}
                />
                <div className="flex-grow" />
                <Button
                 size="small"
                 color="inherit"
                 onClick={() => setConsoleVisible(!consoleVisible)}
                 endIcon={consoleVisible ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                >
                    {consoleVisible ? "隐藏" : "显示"}
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default ConsoleToolbar