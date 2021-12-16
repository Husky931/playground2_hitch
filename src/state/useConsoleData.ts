import store from "@lincode/react-global-state"
import { throttle } from "@lincode/utils"
import { getProject } from "./useProject"

type Data = { prefix?: string, message: string }

const [useConsoleData, setConsoleData0, getConsoleData] = store<[Array<Data>]>([[]])
export { useConsoleData }

export const resetConsoleData = () => setConsoleData0([[]])

const setConsoleData = throttle(setConsoleData0, 0, "trailing")

export const pushConsoleData = (data: Data) => {
    const [consoleData] = getConsoleData()
    consoleData.length >= 100 && consoleData.shift()
    consoleData.push(data)
    setConsoleData([consoleData])
}

getProject(p => !p && resetConsoleData)