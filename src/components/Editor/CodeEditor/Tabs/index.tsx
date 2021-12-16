import { pullCodeTabs, useCodeTab, useCodeTabs } from "../../../../state/useCodeTab"
import makeTabs from "../../../utils/makeTabs"

export default makeTabs(useCodeTabs, pullCodeTabs, useCodeTab)