import type worker from "./worker"
import { wrap } from "comlink"
import { getProjectRootURI } from "../../../../../utils/uriGetters"
import { getProject } from "../../../../../state/useProject"
import type { CompileError } from "@pinyinma/transpiler"
import { onFileDelete } from "../../../../../events/onFileDelete"
import { onDirDelete } from "../../../../../events/onDirDelete"
import { onFileRename } from "../../../../../events/onFileRename"
import { onDirRename } from "../../../../../events/onDirRename"
import fetchCompile from "./fetchCompile"
import { getLegacy } from "../../../../../state/useLegacy"
import guid from "@pinyinma/guid"

const languageWorker = wrap<typeof worker>(new Worker(new URL("./worker", import.meta.url)))
export default languageWorker

const init = new Promise<void>(resolve => getLegacy(legacy => languageWorker.init(legacy).then(resolve)))

export const languageWorkerCompile = async (uri: string, code: string) => {
    await init

    if (!uri.endsWith(".ls") && !uri.startsWith(guid))
        return <const>[code, new Map<string, Array<CompileError>>()]
        
    return languageWorker.compile(uri, code)
}

export const languageWorkerCompileModule = async (uri: string, code: string) => {
    await init

    if (!uri.endsWith(".ls") && !uri.startsWith(guid)) return
    await languageWorker.compileModule(uri, code)
}

languageWorker.setFetchCompile(fetchCompile)
getProject(p => p && languageWorker.setCWD(getProjectRootURI()))
onFileRename(([from, to]) => languageWorker.renameFile(from, to))
onFileDelete(uri => languageWorker.deleteFile(uri))
onDirRename(([from, to]) => languageWorker.renameDir(from, to))
onDirDelete(uri => languageWorker.deleteDir(uri))