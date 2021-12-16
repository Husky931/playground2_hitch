import store from "@lincode/react-global-state"
import { getCodeTab } from "./useCodeTab"

const [useVisualScripting, setVisualScripting] = store(false)
export { useVisualScripting }

getCodeTab(tab => setVisualScripting(!!tab?.endsWith(".lvs")))