import { getFileContent, assignFileContent } from "../../../state/useFileContent"
import { assignFileLoading, omitFileLoading } from "../../../state/useFileLoading"
import { getGameEditorTab } from "../../../state/useGameEditorTab"
import dirTreeReady from "../../../state/utils/dirTreeReady"
import { getAbsoluteURI } from "../../../utils/uriGetters"
import transformResponse from "../../../utils/transformResponse"
import { http } from "../../../utils/http"

const fetchGameFile = async (src: string): Promise<string> => {
    const uri = getAbsoluteURI(src, true)
    if (uri === "/404") return ""
    
    const existing = getFileContent()[uri]
    if (existing) return existing

    assignFileLoading({ [uri]: true })

    const fetchPromise = new Promise<string>(async resolve => {
        await dirTreeReady[0]

        try {
            const { data } = await http.get(uri, { transformResponse })
            resolve(data)
        }
        catch {
            resolve("")
        }

        omitFileLoading(uri)
    })

    assignFileContent({ [uri]: fetchPromise })

    return fetchPromise
}
export default fetchGameFile

getGameEditorTab(tab => tab && fetchGameFile(tab))