import { assert } from "@lincode/utils"
import { validateName } from "@pinyinma/validators"
import queryUser from "../../queries/queryUser"
import { setDialog } from "@pinyinma/dialog"
import { getUser } from "../../state/useUser"

export default () => {
    const user = getUser()
    assert(user)

    setDialog({
        message: "姓名",
        prompt: true,
        validator: validateName,
        onConfirm: name => queryUser({ _id: user._id, record: { name } }, "mutation", "userUpdateById")
    })
}