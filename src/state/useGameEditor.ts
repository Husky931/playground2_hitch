import store, { createEffect } from "@lincode/react-global-state"
import { decreasePreviewPauseCount, increasePreviewPauseCount } from "./usePreviewPauseCount"

const [useGameEditor, setGameEditor, getGameEditor] = store(false)
export { useGameEditor, setGameEditor }

createEffect(() => {
    if (!getGameEditor()) return

    increasePreviewPauseCount()

    return () => {
        decreasePreviewPauseCount()
    }
}, [getGameEditor])