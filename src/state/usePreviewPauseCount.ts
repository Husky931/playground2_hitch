import store from "@lincode/react-global-state"

const [usePreviewPauseCount, setPreviewPauseCount, getPreviewPauseCount] = store(0)
export { usePreviewPauseCount }

export const increasePreviewPauseCount = () => setPreviewPauseCount(getPreviewPauseCount() + 1)

export const decreasePreviewPauseCount = () => setPreviewPauseCount(getPreviewPauseCount() - 1)