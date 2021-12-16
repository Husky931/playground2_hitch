import autoResetStore from "./utils/autoResetStore"

export const [usePreviewCamera, setPreviewCamera, getPreviewCamera] = autoResetStore(-1)