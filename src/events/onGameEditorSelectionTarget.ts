import { event } from "@lincode/events"
import { BaseNode } from "../state/useGameEditorGraph"

export const [emitGameEditorSelectionTarget, onGameEditorSelectionTarget] = event<BaseNode | undefined>()