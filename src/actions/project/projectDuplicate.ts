import { IProject } from "@pinyinma/datatypes"
import queryProjectCreate from "../../queries/queryProjectCreate"
import projectDialog from "../utils/projectDialog"

export default (project: IProject) => {
    projectDialog(title => queryProjectCreate({ _id: project._id, title }, "projectDuplicate"))
}