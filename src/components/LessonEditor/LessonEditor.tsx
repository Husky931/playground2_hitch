import React from "react"
import Chart from "./Chart"
import { createTheme, ThemeProvider } from "@mui/material"
import preventDefault from "../../utils/preventDefault"
import dedent from "ts-dedent"
import TitleBar from "./TitleBar"
import { setLessonEditor } from "../../state/useLessonEditor"

const lightTheme = createTheme({ palette: { mode: "light" } })

const LessonEditor: React.FC = () => {
    return (
        <div className="grid w-full h-full" onContextMenu={preventDefault} style={{
            gridTemplateAreas: dedent`
                "titleBar"
                "stage"
            `,
            gridTemplateRows: `auto minmax(0, 1fr)`
        }}>
            <TitleBar style={{ gridArea: "titleBar" }} onClose={() => setLessonEditor(undefined)} />
            <ThemeProvider theme={lightTheme}>
                <Chart style={{ gridArea: "stage" }} />
            </ThemeProvider>
        </div>
    )
}

export default LessonEditor