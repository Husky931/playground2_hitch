import React from "react"
import { ThemeProvider } from "@mui/material"
import { useTheme } from "@pinyinma/playground-theme"
import VisualScripting from "../components/Editor/CodeEditor/VisualScripting"
import ContextMenu from "@pinyinma/context-menu"
import Dialog from "@pinyinma/dialog"

const Test: React.FC = () => {
    const [theme] = useTheme()
    
    return (
        <ThemeProvider theme={theme}>
            <div className="absfull text-white" style={{ background: theme.customPalette.background.default }}>
                <VisualScripting className="absfull" />
            </div>
            <ContextMenu />
            <Dialog />
        </ThemeProvider>
    )
}
export default Test