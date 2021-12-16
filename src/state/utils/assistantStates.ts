import { GetGlobalState } from "@lincode/react-global-state"
import { getFocus } from "../useFocus"

export default <Record<string, GetGlobalState<string | number | boolean | undefined> | undefined>>{
    getFocus
}