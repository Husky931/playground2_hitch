import { IProject } from "@pinyinma/datatypes"
import { pushProjects } from "../state/useProjects"
import { graphqlTyped } from "../utils/http"

export default async (params: Partial<IProject>, queryName = "projectCreate") => {
    pushProjects(await graphqlTyped<IProject>(
        "mutation",
            queryName, params, {
                _id: true,
                title: true,
                owner: true,
                lesson: true,
                deleted: true,
                platformVersion: true,
                type: true,
                createdAt: true
            }
        )
    )
}