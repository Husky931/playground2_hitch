import { useGameEditorTabs, pullGameEditorTabs, useGameEditorTab } from "../../../state/useGameEditorTab"
import makeTabs from "../../utils/makeTabs"

export default makeTabs(useGameEditorTabs, pullGameEditorTabs, useGameEditorTab)