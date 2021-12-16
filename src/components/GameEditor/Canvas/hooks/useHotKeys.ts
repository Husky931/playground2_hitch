import { useEffect } from "react"
import { handleGameEditorSave } from "./useSave"

export default () => {
    useEffect(() => {
        const cb = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s")
                handleGameEditorSave()
        }
        document.addEventListener("keydown", cb)
        
        return () => {
            document.removeEventListener("keydown", cb)
        }
    }, [])
}