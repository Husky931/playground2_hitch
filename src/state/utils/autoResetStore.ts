import store from "@lincode/react-global-state"
import { reset } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { IProject } from "@pinyinma/datatypes"
import { getProject } from "../useProject"

type Options = {
    debounceSet?: boolean
}

export default <T>(defaultValue: T, options?: Options) => {
    const [useState, setState0, getState] = store<T>(defaultValue)
    const setState = options?.debounceSet ? debounce(setState0, 1, "trailing") : setState0

    const resetState = reset(setState, getState)

    let pOld: IProject | undefined
    getProject(p => {
        !p && pOld && resetState()
        pOld = p
    })

    return <const>[useState, setState, getState, resetState]
}