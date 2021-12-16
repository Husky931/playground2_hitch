import { http } from "../utils/http"
import { getProjectRootURI } from "../utils/uriGetters"
import { getProject } from "./useProject"
import autoResetStore from "./utils/autoResetStore"

const [, setDirJSON, getDirJSON] = autoResetStore<any>(undefined)
export { getDirJSON }

getProject(async p => {
    if (!p) return
    const rootURI = getProjectRootURI()
    const { data } = await http.get(`${rootURI}/dir.json`)
    setDirJSON(data)
})