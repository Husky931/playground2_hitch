import React from "react"
import { ThemeProvider } from "@mui/material"
import { useTheme } from "@pinyinma/playground-theme"
import GameObjectNode from "../components/Editor/CodeEditor/VisualScripting/nodes/GameObjectNode"

const Test: React.FC = () => {
    const [theme] = useTheme()
    
    return (
        <ThemeProvider theme={theme}>
            <div className="absfull p-10" style={{ background: theme.customPalette.background.default }}>
                <div className="w-64">
                    <GameObjectNode data={{
                        type: "GameObjectNode",
                        kind: "cube",
                        properties: {
                            width: 100,
                            height: 100,
                            bloom: true
                        }
                    }} />
                </div>
            </div>
        </ThemeProvider>
    )
}
export default Test