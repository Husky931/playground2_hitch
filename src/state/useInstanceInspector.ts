import store from "@lincode/react-global-state"
import type { InstanceProperties } from "@pinyinma/transpiler"

export const [useInstanceInspector, setInstanceInspector] = store<InstanceProperties | undefined>(undefined)