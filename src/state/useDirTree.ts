import { DirTree } from "@pinyinma/datatypes"
import autoResetStore from "./utils/autoResetStore"
import { getDirJSON } from "./useDirJSON"
import { getProjectRootURI } from "../utils/uriGetters"

export const [useDirTree, setDirTree, getDirTree] = autoResetStore<DirTree | undefined>(undefined)

const proxyHandler = {
    get(obj: DirTree, key: string) {
        //todo: constructor needs to be a reserved file name? dist.js and dir.json definitely needs to be reserved
        if (typeof key !== "string" || key === "constructor") return

        const child = obj[key]

        if (key === "/")
            return child

        if (typeof child === "string")
            return obj["/"] + "/" + key

        if (child)
            return buildDirTree(child, obj["/"] + "/" + key)
    },
    set(obj: DirTree, key: string, value: string | DirTree) {
        obj[key] = value
        return true
    },
    deleteProperty(obj: DirTree, key: string) {
        delete obj[key]
        return true
    }
}

const buildDirTree = (dirTree: DirTree, fullPath: string): DirTree => {
    dirTree["/"] = fullPath
    return new Proxy(dirTree, proxyHandler)
}

const scanDirTree = (dirTree: DirTree, parentPath = "", fileURIs: Array<string> = []) => {
    for (let [key, value] of Object.entries(dirTree)) {
        parentPath && (key = parentPath + "/" + key)

        if (key.endsWith(".ls"))
            fileURIs.push(key)
        else if (typeof value === "object")
            scanDirTree(value, key, fileURIs)
    }
    return fileURIs
}

getDirJSON(async data => {
    if (!data) return

    const fileURIs = scanDirTree(data)
    const rootURI = getProjectRootURI()
    const dataProxy = buildDirTree(data, rootURI)

    const { default: languageWorker } = await import("../components/Editor/CodeEditor/lingoscript/languageWorker")
    await languageWorker.registerFiles(fileURIs)

    data["/"] = rootURI
    setDirTree(dataProxy)
})