import autoResetStore from "./utils/autoResetStore"
import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import type { BaseNode } from "./useGameEditorGraph"

export const [useGameEditorSelectionTarget, setGameEditorSelectionTarget, , resetGameEditorSelectionTarget] = autoResetStore<{ instance?: SimpleObjectManager, nodes: Array<BaseNode | undefined> }>({ nodes: [] }, { debounceSet: true })