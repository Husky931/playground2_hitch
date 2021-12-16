import store from "@lincode/react-global-state"
import { IProject, isIProject } from "@pinyinma/datatypes"
import makeNullableValidator from "../utils/makeNullableValidator"

export const [useProject, setProject, getProject] = store<IProject | undefined>(undefined, {
    validator: makeNullableValidator(isIProject),
    validatorErrMsg: "project validator failed"
})