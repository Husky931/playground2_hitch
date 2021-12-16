import store, { createEffect } from "@lincode/react-global-state"
import { defaultLessons, getLessons } from "./useLessons"
import { decreaseLoadingCount, increaseLoadingCount } from "./useLoadingCount"
import { defaultProjects, getProjects } from "./useProjects"
import { getUser } from "./useUser"

const [useHomeReady, setHomeReady, getHomeReady] = store(false)
export { useHomeReady }

getHomeReady(ready => {
    ready ? decreaseLoadingCount() : increaseLoadingCount()
})

createEffect(() => {
    const lessons = getLessons()
    const projects = getProjects()
    const user = getUser()

    if (lessons === defaultLessons || (user && projects === defaultProjects)) {
        setHomeReady(false)
        return
    }

    const timeout = setTimeout(() => setHomeReady(true), 500)

    return () => {
        clearTimeout(timeout)
    }
}, [getLessons, getProjects, getUser])