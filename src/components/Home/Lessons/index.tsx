import React, { useMemo } from "react"
import CardCarousel from "@lincode/react-card-carousel"
import { useLessonsSorted } from "../../../state/useLessons"
import LessonCard from "./LessonCard"
import { lessonIsUnlocked, useProjects } from "../../../state/useProjects"
import { ILesson } from "@pinyinma/datatypes"
import { HOME_SIDEBAR_WIDTH } from "../../../globals"
import ICP from "../../ICP"

const isNewer = (l0: ILesson, l1: ILesson) => Date.parse(l0.createdAt) > Date.parse(l1.createdAt)

const Content: React.FC = () => {
    const [projects] = useProjects()
    const lessonsSorted = useLessonsSorted(true, lessonIsUnlocked, [projects])
    const lessons = useMemo(() => {
        const dedupedLessonsMap = new Map<string, ILesson>()
        for (const lesson of lessonsSorted) {
            const id = lesson.original ?? lesson._id
            const existing = dedupedLessonsMap.get(id)
            if (!existing || (isNewer(lesson, existing) && !lessonIsUnlocked(existing)))
                dedupedLessonsMap.set(id, lesson)
        }
        return [...dedupedLessonsMap.values()]
    }, [lessonsSorted])

    return (
        <div>
            <div className="absolute h-full right-0 overflow-hidden" style={{ width: `calc(100% + ${HOME_SIDEBAR_WIDTH}px)` }}>
                <div className="absolute h-full right-0" style={{ width: `calc(100% - ${HOME_SIDEBAR_WIDTH}px)` }}>
                    <div className="text-xl text-center opacity-50 mt-16">
                        课堂项目
                    </div>
                    {!!lessons.length && (
                        <CardCarousel key={lessons.length} className="absfull mt-10">
                            {lessons.map((l, i) => (
                                <LessonCard l={l} i={i} key={i} />
                            ))}
                        </CardCarousel>
                    )}
                    <ICP />
                </div>
            </div>
        </div>
    )
}

export default Content