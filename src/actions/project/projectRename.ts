import { IProject } from "@pinyinma/datatypes"
import queryProjectUpdate from "../../queries/queryProjectUpdate"
import projectDialog from "../utils/projectDialog"

export default (project: IProject) => {
    projectDialog(title => queryProjectUpdate(project, { title }))
}