import store, { createEffect } from "@lincode/react-global-state"
import { getLessonEditor } from "./useLessonEditor"
import { decreasePreviewPauseCount, increasePreviewPauseCount } from "./usePreviewPauseCount"

const [useLessonEditorHidden, setLessonEditorHidden, getLessonEditorHidden] = store(false)
export { useLessonEditorHidden, setLessonEditorHidden }

createEffect(() => {
    if (!getLessonEditor() || getLessonEditorHidden()) return
    
    increasePreviewPauseCount()

    return () => {
        decreasePreviewPauseCount()
    }
}, [getLessonEditor, getLessonEditorHidden])