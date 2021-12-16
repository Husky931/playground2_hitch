import React from "react"
import { CircularProgress } from "@mui/material"
import { useLoadingCount } from "../../state/useLoadingCount"
import ModalDialog from "@pinyinma/modal-dialog"

const Loading: React.FC = () => {
    const [loadingCount] = useLoadingCount()

    return (
        <ModalDialog open={loadingCount > 0}>
            <div className="w-20 h-20 flex items-center justify-center">
                <CircularProgress />
            </div>
        </ModalDialog>
    )
}

export default Loading