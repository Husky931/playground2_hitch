import React, { useRef } from "react"
import getGradient from "../../../utils/getGradient"
import lessonOpen from "../../../actions/lesson/lessonOpen"
import lessonUnlock from "../../../actions/lesson/lessonUnlock"
import AnimLock from "../utils/AnimLock"
import { ILesson } from "@pinyinma/datatypes"
import lessonContextMenu from "../../../actions/lesson/lessonContextMenu"
import { useClick } from "@lincode/hooks"
import { lessonIsUnlocked } from "../../../state/useProjects"

const removeExtension = (title: string) => {
    const parts = title.split("+")
    parts.pop()
    return parts.join("+")
}

const LessonCard: React.FC<{ l: ILesson, i: number }> = ({ l, i }) => {
    const clickCbRef = useRef<() => void>()
    const setClickEl = useClick(() => setTimeout(() => clickCbRef.current?.()))

    return (
        <div
         className={`lingo-lesson-card${i} w-full h-full rounded-xl overflow-hidden p-6 ${getGradient(i)}`}
         ref={setClickEl}
        >
            <div className="absfull opacity-25" />
            <div className="text-xl opacity-75">
                {`第${i + 1}课`}
            </div>
            <div className="text-2xl font-bold">
                {l.original ? removeExtension(l.title) : l.title}
            </div>
            {/* <div className="absolute bottom-0 pb-8 opacity-75">
                {`已完成：${1} / ${10}`}
            </div> */}
            <div
             className="absfull cursor-pointer"
             onClick={() => clickCbRef.current = () => lessonOpen(l)}
             onContextMenu={e => (e.preventDefault(), lessonContextMenu(l))}
            />
            <AnimLock
             locked={!lessonIsUnlocked(l)}
             onClick={() => clickCbRef.current = () => lessonUnlock(l)}
             onContextMenu={() => lessonContextMenu(l, true)}
            />
        </div>
    )
}
export default LessonCard