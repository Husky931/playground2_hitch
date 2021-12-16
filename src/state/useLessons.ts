import store, { push, filter, refresh } from "@lincode/react-global-state"
import { ILesson, isILessons } from "@pinyinma/datatypes"
import { useMemo } from "react"
import { insert } from "@lincode/utils"
import { graphqlTypedMany } from "../utils/http"

export const defaultLessons = []

const [useLessons, setLessons, getLessons] = store<Array<ILesson>>(defaultLessons, {
    validator: isILessons,
    validatorErrMsg: "lessons validator failed",
    fetchData: () => {
        return graphqlTypedMany<ILesson>(
            "query",
                "lessonMany", {}, {
                    _id: true,
                    title: true,
                    isWebLesson: true,
                    hidden: true,
                    original: true,
                    previous: true,
                    createdAt: true
                }
        )
    }
})
export { getLessons }

const sortLessons = (lessons: Array<ILesson>) => {
    const unordered: Array<ILesson> = []
    const ordered = new Set<ILesson>()

    for (const lesson of lessons) {
        if (lesson.previous)
            ordered.add(lesson)
        else
            unordered.push(lesson)
    }

    while (true) {
        let done = true
        for (const lesson of ordered) {
            const index = unordered.findIndex(l => l._id === lesson.previous)
            if (index === -1) {
                done = false
                continue
            }
            insert(unordered, lesson, index + 1)
            ordered.delete(lesson)
        }
        if (done) break
    }
    return unordered
}

export const useLessonsSorted = (
    isClassroom: boolean, showHiddenLesson: (item: ILesson) => boolean, deps: Array<unknown>
) => {
    const [allLessons] = useLessons()

    return useMemo(() => {
        return sortLessons(allLessons).filter(
            l => (!l.hidden || showHiddenLesson(l)) && isClassroom ? !l.isWebLesson : l.isWebLesson
        )
    }, [allLessons, ...deps])
}

export const pushLessons = push(setLessons, getLessons)
export const filterLessons = filter(setLessons, getLessons)
export const refreshLessons = refresh(setLessons, getLessons)