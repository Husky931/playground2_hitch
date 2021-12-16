import { IProject } from "@pinyinma/datatypes"
import { refreshProjects } from "../state/useProjects"
import { graphqlTypedPartial } from "../utils/http"

export default async (project: IProject, params: Partial<IProject>) => {
    Object.assign(project, await graphqlTypedPartial<IProject>(
        "mutation",
            "projectUpdate", { _id: project._id, ...params }, params
        )
    )
    refreshProjects()
}