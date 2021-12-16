import autoResetStore from "./utils/autoResetStore"

export const [usePreviewCameraCount, setPreviewCameraCount, getPreviewCameraCount] = autoResetStore(0)