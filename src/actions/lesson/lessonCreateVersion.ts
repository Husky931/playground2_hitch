import { ILesson } from "@pinyinma/datatypes"
import queryLessonCreate from "../../queries/queryLessonCreate"
import { setDialog } from "@pinyinma/dialog"
import { getLessons } from "../../state/useLessons"

export default (original: ILesson) => {
    setDialog({
        message: "确定要创建新版本吗？",
        onConfirm: () => {
            if (original.original) {
                const found = getLessons().find(l => l._id === original.original)
                found && (original = found)
            }

            const { title, isWebLesson, hidden, _id } = original
        
            return queryLessonCreate({
                title: title + "+" + getLessons().filter(l => l.original === _id).length,
                isWebLesson,
                hidden,
                original: _id,
                previous: _id
            })
        }
    })
}