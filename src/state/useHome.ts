import store, { createEffect } from "@lincode/react-global-state"
import { setAssistantOpen } from "./useAssistantOpen"
import { setAssistantShow } from "./useAssistantShow"
import { getUser } from "./useUser"

type Options = "lessons" | "webLessons" | "projectManager" | "lessonManager" | "modelManager"

export const [useHome, setHome, getHome] = store<Options>("lessons")

getUser(user => !user && setHome("lessons"))

createEffect(() => {
    const home = getHome()
    setAssistantShow(home === "webLessons")

    if (home === "webLessons") {
        const timeout = setTimeout(() => setAssistantOpen(true), 1000)
        return () => {
            clearTimeout(timeout)
        }
    }
    else setAssistantOpen(false)

}, [getHome])