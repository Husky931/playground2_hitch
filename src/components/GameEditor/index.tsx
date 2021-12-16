import React from "react"
import { useGameEditor } from "../../state/useGameEditor"
import UISuspense from "@pinyinma/ui-suspense"
import ModalDialog from "@pinyinma/modal-dialog"

const GameEditor = React.lazy(() => import("./GameEditor"))

const GameEditorDialog: React.FC = () => {
    const [gameEditor] = useGameEditor()

    return (
        <ModalDialog open={gameEditor} fullScreen>
            <UISuspense>
                <GameEditor />
            </UISuspense>
        </ModalDialog>
    )
}

export default GameEditorDialog