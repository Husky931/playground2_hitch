import React from "react"
import { useLessonEditorHidden } from "../../state/useLessonEditorHidden"
import { useLessonEditor } from "../../state/useLessonEditor"
import UISuspense from "@pinyinma/ui-suspense"
import ModalDialog from "@pinyinma/modal-dialog"

const LessonEditor = React.lazy(() => import("./LessonEditor"))

const LessonEditorDialog: React.FC = () => {
    const [lesson] = useLessonEditor()
    const [hidden] = useLessonEditorHidden()

    return (
        <ModalDialog
         open={!!lesson}
         fullScreen
         style={{ transform: `translateY(${hidden ? "calc(100% - 50px)" : "0"})` }}
        >
            <UISuspense>
                <LessonEditor />
            </UISuspense>
        </ModalDialog>
    )
}

export default LessonEditorDialog