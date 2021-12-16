import { SceneGraph } from "./useGameEditorGraph"
import makeUseFileRecord from "./utils/makeUseFileRecord"

export const [, , getGameEditorGraphs, assignGameEditorGraphs, omitGameEditorGraphs] = makeUseFileRecord<SceneGraph>()