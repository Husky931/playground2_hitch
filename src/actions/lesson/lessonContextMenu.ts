import { ILesson } from "@pinyinma/datatypes"
import { getAdmin } from "../../state/useAdmin"
import { setContextMenu } from "@pinyinma/context-menu"
import { setLessonEditor } from "../../state/useLessonEditor"
import { setPreviewSafeMode } from "../../state/usePreviewSafeMode"
import lessonOpen from "./lessonOpen"
import lessonReplay from "./lessonReplay"
import lessonReset from "./lessonReset"

export default (l: ILesson, locked?: boolean) => {
    if (locked) {
        getAdmin() && setContextMenu([
            { text: "编辑对话", onClick: () => (setLessonEditor(l), lessonOpen(l)) }
        ])
        return
    }
    setContextMenu([
        { text: "安全模式", onClick: () => (setPreviewSafeMode(true), lessonOpen(l)) },
        { text: "回放课程", onClick: () => lessonReplay(l) },
        ...(getAdmin() ? [
            { text: "重置课程", onClick: () => lessonReset(l) },
            { text: "编辑回放", onClick: () => lessonReplay(l, true) },
            { text: "编辑对话", onClick: () => (setLessonEditor(l), lessonOpen(l)) }
        ] : [])
    ])
}