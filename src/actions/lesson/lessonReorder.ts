import { ILesson } from "@pinyinma/datatypes"
import queryLessonUpdate from "../../queries/queryLessonUpdate"
import { setDialog } from "@pinyinma/dialog"
import { getLessons } from "../../state/useLessons"

export default (lesson: ILesson) => {
    setDialog({
        message: "上一节课程的名字",
        prompt: true,
        promptDefault: getLessons().find(l => l._id === lesson.previous)?.title,
        onConfirm: val => {
            const found = getLessons().find(l => l.title === val)
            if (!found)
                throw new Error("课程不存在")
                
            return queryLessonUpdate(lesson, { previous: found._id })
        }
    })
}