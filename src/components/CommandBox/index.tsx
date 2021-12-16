import { Fade, Paper } from "@mui/material"
import ModalDialog from "@pinyinma/modal-dialog"
import React from "react"
import { useCommandBox } from "../../state/useCommandBox"
import CommandSearch from "./CommandSearch"
import stopPropagation from "../../utils/stopPropagation"

const CommandBox: React.FC = () => {
    const [open] = useCommandBox()

    return (
        <ModalDialog
         open={open}
         TransitionComponent={Fade}
         transitionDuration={300}
         PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
        >
            <div className="h-screen">
                <Paper className="p-4" elevation={24} onClick={stopPropagation}>
                    <CommandSearch />
                </Paper>
            </div>
        </ModalDialog>
    )
}

export default CommandBox