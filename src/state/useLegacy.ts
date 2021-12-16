import store from "@lincode/reactivity"
import { getProject } from "./useProject"

export type Legacy = "1.0.0" | "0.0.1" | "latest"

const [setLegacy, getLegacy] = store<Legacy>("latest")
export { getLegacy }

getProject(p => {
    if (!p) {
        setLegacy("latest")
        return
    }
    if (!p.platformVersion) {
        setLegacy("0.0.1")
        return
    }
    if (p.platformVersion === "1.0.0") {
        setLegacy("1.0.0")
        return
    }
    if (p.platformVersion === "2.0.0") {
        setLegacy("latest")
        return
    }
    throw new Error("unexpected platform version " + p.platformVersion)
})