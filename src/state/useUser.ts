import store, { assign } from "@lincode/react-global-state"
import { IUser, isIUser } from "@pinyinma/datatypes"
import { del, get, set } from "../utils/jsonStorage"
import makeNullableValidator from "../utils/makeNullableValidator"

export const [useUser, setUser, getUser] = store<IUser | undefined>(undefined, {
    validator: makeNullableValidator(isIUser),
    validatorErrMsg: "user validator failed"
})

export const assignUser = assign(setUser, getUser)

setUser(get("user"))
getUser(user => user ? set("user", user) : del("user"))