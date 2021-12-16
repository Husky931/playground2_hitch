import queryLessonCreate from "../../queries/queryLessonCreate"
import projectDialog from "../utils/projectDialog"

export default (isWebLesson?: boolean) => {
    projectDialog(title => queryLessonCreate({ title, isWebLesson, hidden: isWebLesson }))
}