import { Resolvable } from "@lincode/promiselikes"
import { emitNotification } from "../events/onNotification"
import autoResetStore from "./utils/autoResetStore"

export const [, setPreviewSafeMode, getPreviewSafeMode] = autoResetStore(false)

getPreviewSafeMode(safeMode => {
    safeMode && emitNotification(["安全模式", "warning", {
        text: "退出",
        complete: new Resolvable(async () => {
            setPreviewSafeMode(false)
            const { controls } = await import("../components/Editor/CodeEditor/Code")
            controls.saveAll()
        })
    }])
})