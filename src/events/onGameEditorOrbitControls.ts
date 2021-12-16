import { event } from "@lincode/events"

export const [emitGameEditorOrbitControls, onGameEditorOrbitControls] = event<"start" | "stop" | "move">()