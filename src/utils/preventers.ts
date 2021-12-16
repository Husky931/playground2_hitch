import { createEffect } from "@lincode/reactivity"
import { setDialog } from "@pinyinma/dialog"
import { setAdmin } from "../state/useAdmin"
import { setCodeTranslation } from "../state/useCodeTranslation"
import { getDebug, setDebug } from "../state/useDebug"
import preventDefault from "./preventDefault"

document.addEventListener("dragover", preventDefault)
document.addEventListener("dragenter", preventDefault)
document.addEventListener("dragleave", preventDefault)
document.addEventListener("drop", preventDefault)

const allowedHotKeys = new Set<string>(["=", "-", "0", "a", "c", "v", "x", "z", "f"])
document.addEventListener("keydown", e => {
    if (!e.metaKey && !e.ctrlKey) return
    !allowedHotKeys.has(e.key.toLowerCase()) && e.preventDefault()
})

createEffect(() => {
    const debug = getDebug()
    if (debug) return
    
    document.addEventListener("contextmenu", preventDefault)
    return () => document.removeEventListener("contextmenu", preventDefault)

}, [getDebug])

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.ctrlKey && e.altKey) {
        if (e.key === "1" || e.key === "¡") {
            setDialog({
                message: "请输入密码",
                prompt: true,
                onConfirm: val => {
                    val === "asdfasdf1" && setAdmin(true)
                }
            })
        }
        else if (e.key === "2" || e.key === "@")
            setDebug(true)
    }
    else if (e.ctrlKey && e.key === "1")
        setCodeTranslation(true)
})