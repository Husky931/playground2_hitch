import autoResetStore from "./utils/autoResetStore"

export const [usePreviewPicker, , getPreviewPicker] = autoResetStore(false)