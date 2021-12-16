import { ILesson } from "@pinyinma/datatypes"
import queryLessonUpdate from "../../queries/queryLessonUpdate"
import projectDialog from "../utils/projectDialog"

export default (lesson: ILesson) => {
    projectDialog(title => queryLessonUpdate(lesson, { title }))
}