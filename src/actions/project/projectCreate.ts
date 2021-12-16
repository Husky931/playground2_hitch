import queryProjectCreate from "../../queries/queryProjectCreate"
import { getUser } from "../../state/useUser"
import projectDialog from "../utils/projectDialog"

export default () => {
    projectDialog(title => queryProjectCreate({ title, owner: getUser()!._id }))
}