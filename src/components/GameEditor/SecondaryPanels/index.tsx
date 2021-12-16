import { AppBar, Toolbar } from "@mui/material"
import React, { useState } from "react"
import ScenePanel from "./ScenePanel"
import ButtonTabs from "../../ButtonTabs"
import PrimitivesPanel from "./PrimitivesPanel"

interface SecondaryPanelsProps {
    style: React.CSSProperties
}

const SecondaryPanels: React.FC<SecondaryPanelsProps> = ({ style }) => {
    const [panel, setPanel] = useState<"3d" | "scene">("3d")

    return (
        <div className="flex flex-col" style={{ width: 200, ...style }}>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar variant="dense">
                    <ButtonTabs tabs={{
                        "场景": () => setPanel("scene"),
                        "3D": () => setPanel("3d")
                    }} />
                </Toolbar>
            </AppBar>
            <div className="px-4 overflow-y-scroll opacity-75 flex-grow">
                {panel === "scene" && <ScenePanel />}
                {panel === "3d" && <PrimitivesPanel />}
            </div>
        </div>
    )
}

export default SecondaryPanels