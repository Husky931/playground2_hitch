import { AppBar, IconButton, Toolbar, Tooltip } from "@mui/material"
import React from "react"
import { useGameEditorSelectionTarget } from "../../../../state/useGameEditorSelectionTarget"
import { useTheme } from "@pinyinma/playground-theme"
import { nanoid } from "nanoid"
import makePrimitiveIcons from "../../../utils/makePrimitiveIcons"
import { userAddBaseNode } from "../../../../state/useGameEditorGraph"

const ObjectBar: React.FC = () => {
    const [{ nodes }] = useGameEditorSelectionTarget()
    const [theme] = useTheme()

    return (
        <AppBar color="transparent" position="absolute" elevation={0}>
            <div className="absfull opacity-50" style={{ background: theme.customPalette.background.default }} />
            <Toolbar variant="dense">
                {makePrimitiveIcons().map(([type, icon]) => (
                    <Tooltip key={type} title={type} arrow>
                        <IconButton onClick={() => userAddBaseNode({ type: type as any, uuid: nanoid() })}>
                            {icon}
                        </IconButton>
                    </Tooltip>
                ))}
            </Toolbar>
        </AppBar>
    )
}

export default ObjectBar