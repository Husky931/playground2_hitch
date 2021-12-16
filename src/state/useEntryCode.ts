import { getPreviewCode } from "./usePreviewCode"
import { getAbsoluteURI } from "../utils/uriGetters"
import autoResetStore from "./utils/autoResetStore"

export const [, setEntryCode, getEntryCode] = autoResetStore("")

getPreviewCode(previewCode => previewCode?.uri === getAbsoluteURI("app.ls") && setEntryCode(previewCode.code))