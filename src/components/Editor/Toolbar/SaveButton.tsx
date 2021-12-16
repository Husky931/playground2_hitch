import React from "react"
import { useCodeTab } from "../../../state/useCodeTab"
import { useFileUnsaved } from "../../../state/useFileUnsaved"
import SaveIcon from "@mui/icons-material/Save"
import { IconButton, Badge } from "@mui/material"
import { save } from "../CodeEditor"

const SaveButton: React.FC = React.memo(() => {
    const [fileUnsaved] = useFileUnsaved()
    const [codeTab] = useCodeTab()

    return (
        <IconButton className="lingo-toolbar-save" onClick={save}>
            <Badge badgeContent={codeTab && (codeTab in fileUnsaved) ? 1 : 0} color="error">
                <SaveIcon fontSize="small" />
            </Badge>
        </IconButton>
    )
})

export default SaveButton