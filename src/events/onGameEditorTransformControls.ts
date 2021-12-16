import { event } from "@lincode/events"

export const [emitGameEditorTransformControls, onGameEditorTransformControls] = event<"start" | "stop" | "move">()