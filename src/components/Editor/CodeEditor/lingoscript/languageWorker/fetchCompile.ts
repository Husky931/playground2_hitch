import { proxy } from "comlink"
import languageWorker, { languageWorkerCompileModule } from "."
import { assignFileLoading, omitFileLoading } from "../../../../../state/useFileLoading"
import { getCodeTab } from "../../../../../state/useCodeTab"
import { getFileContent, assignFileContent } from "../../../../../state/useFileContent"
import { getAbsoluteURI } from "../../../../../utils/uriGetters"
import dirTreeReady from "../../../../../state/utils/dirTreeReady"
import transformResponse from "../../../../../utils/transformResponse"
import { http } from "../../../../../utils/http"

export const fetchCodeFile = async (src: string): Promise<string> => {
    const uri = getAbsoluteURI(src, true)
    if (uri === "/404") return ""

    const existing = getFileContent()[uri]
    if (existing) return existing

    assignFileLoading({ [uri]: true })

    const fetchPromise = new Promise<string>(async resolve => {
        await dirTreeReady[0]

        try {
            const { data } = await http.get(uri, { transformResponse })
            
            for (const importURI of await languageWorker.scanImports(uri, data)) {
                if (getAbsoluteURI(importURI, true) in getFileContent()) continue
                await fetchCodeFile(importURI)
            }

            await languageWorkerCompileModule(uri, data)
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
getCodeTab(tab => tab && fetchCodeFile(tab))

export default proxy(async (uris: Array<string>) => {
    for (const uri of uris)
        await fetchCodeFile(uri)
})