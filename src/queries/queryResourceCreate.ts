import { IResource } from "@pinyinma/datatypes"
import { graphqlTyped } from "../utils/http"

export default (params: Partial<IResource>) => {
    return graphqlTyped<IResource>(
        "mutation",
            "resourceCreate", params, {
                _id: true,
                title: true,
                type: true,
                tags: true,
                original: true,
                version: true,
                owner: true,
                createdAt: true
            }
    )
}