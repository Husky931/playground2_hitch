import { AppBar, Toolbar } from "@mui/material"
import React from "react"
import PropertiesPanel from "./PropertiesPanel"

const PrimaryPanels: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    return (
        <div className="flex flex-col" style={{ width: 360, ...style }}>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar variant="dense">
                    <div>属性面板</div>
                </Toolbar>
            </AppBar>
            <PropertiesPanel />
        </div>
    )
}

export default PrimaryPanels