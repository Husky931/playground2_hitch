import { omitGameEditorGraphs } from "./useGameEditorGraphs"
import makeUseTabs from "./utils/makeUseTabs"

export const [useGameEditorTab, setGameEditorTab, getGameEditorTab, useGameEditorTabs, pullGameEditorTabs] = makeUseTabs(t => {
    omitGameEditorGraphs(t)
})