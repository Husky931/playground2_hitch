import store, { push, refresh } from "@lincode/react-global-state"
import { ILesson, IProject, isIProjects } from "@pinyinma/datatypes"
import { graphqlTypedMany } from "../utils/http"
import { getUser } from "./useUser"

export const defaultProjects = []

export const [useProjects, setProjects, getProjects] = store<Array<IProject>>(defaultProjects, {
    validator: isIProjects,
    validatorErrMsg: "projects validator failed"
})

export const pushProjects = push(setProjects, getProjects)

export const refreshProjects = refresh(setProjects, getProjects)

getUser(async user => {
    if (user)
        setProjects(await graphqlTypedMany<IProject, { filter: { owner: string } }>(
            "query",
                "projectMany", { filter: { owner: user._id } }, {
                    _id: true,
                    title: true,
                    owner: true,
                    lesson: true,
                    deleted: true,
                    platformVersion: true,
                    type: true,
                    createdAt: true
                }
        ))
    else setProjects(defaultProjects)
})

export const unlockedLessonIdProjectMap = new Map<string, IProject>()

const isNewer = (l0: IProject, l1: IProject) => Date.parse(l0.createdAt) > Date.parse(l1.createdAt)

getProjects(projects => {
    unlockedLessonIdProjectMap.clear()
    for (const p of projects) {
        if (!p.lesson || p.deleted) continue

        if (unlockedLessonIdProjectMap.has(p.lesson)) {
            const existing = unlockedLessonIdProjectMap.get(p.lesson)!
            isNewer(p, existing) && unlockedLessonIdProjectMap.set(p.lesson, p)
        }
        else unlockedLessonIdProjectMap.set(p.lesson, p)
    }
})

export const lessonIsUnlocked = (lesson: ILesson) => unlockedLessonIdProjectMap.has(lesson._id)