import { assert, get } from "@lincode/utils"
import { getDirTree } from "../state/useDirTree"
import { getProject } from "../state/useProject"

export const getProjectRootURI = () => {
    const p = getProject()
    return p ? `/projects/${p._id}` : "/404"
}

export const getAbsoluteURI = (uri: string, return404?: boolean): string => {
    const projectRootURI = getProjectRootURI() + "/"
    if (uri.startsWith(projectRootURI)) {
        if (return404) {
            if (uri === projectRootURI + "app.ls")
                return uri

            uri = uri.replace(projectRootURI, "")
        }
        else return uri
    }

    const result = get(getDirTree(), uri.split("/"))

    if (typeof result === "string")
        return result
        
    if (typeof result === "object") {
        assert(result["/"], "unexpected dirTree object")
        return result["/"]
    }

    if (return404) return "/404"

    return projectRootURI + uri
}

export const getRelativeURI = (uri: string): string => {
    const projectRootURI = getProjectRootURI() + "/"

    if (uri.startsWith(projectRootURI))
        return uri.replace(projectRootURI, "")

    return uri
}