import { ILesson } from "@pinyinma/datatypes"
import { setCodeSteps } from "../../state/useCodeSteps"
import { setCodeStepsEdit } from "../../state/useCodeStepsEdit"
import { setDialog } from "@pinyinma/dialog"
import { decreaseLoadingCount, increaseLoadingCount } from "../../state/useLoadingCount"
import lessonOpen from "./lessonOpen"
import { http } from "../../utils/http"

export default async (lesson: ILesson, edit = false) => {
    increaseLoadingCount()
    try {
        const { data } = await http.get(`/lessons/${lesson._id}/steps.json`)
        if (!Array.isArray(data)) {
            if (!edit)
                setDialog({ message: "找不到课程回放" })
            else {
                setCodeSteps([])
                setCodeStepsEdit(edit)
                lessonOpen(lesson)
            }
        }
        else {
            setCodeSteps(data)
            setCodeStepsEdit(edit)
            lessonOpen(lesson)
        }
        decreaseLoadingCount()
    }
    catch {
        decreaseLoadingCount()
    }
}