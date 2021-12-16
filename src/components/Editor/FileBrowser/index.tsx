import React, { useMemo } from "react"
import FileToolbar from "./FileToolbar"
import FileButton from "./FileButton"
import { useDirTree } from "../../../state/useDirTree"
import { DirTree } from "@pinyinma/datatypes"
import { ContextMenuOptions } from "@pinyinma/context-menu"
import { Border, LoadingMask } from "@pinyinma/components"
import { forceGet, get, splitFileName } from "@lincode/utils"
import { useDir } from "../../../state/useDir"
import { getProjectRootURI, getRelativeURI } from "../../../utils/uriGetters"
import { useFileBrowserHeight } from "../../../state/useFileBrowserHeight"
import { setDirSelected } from "../../../state/useDirSelected"

const sortDirEntries = (tree?: DirTree) => {
    if (!tree) return []

    const folders: Array<[string, DirTree]> = []
    const fileMap = new Map<string, Array<[string, string]>>()

    for (const [key, value] of Object.entries(tree))
        if (typeof value === "object")
            folders.push([key, value])
        else if (key !== "/") {
            const files = forceGet(fileMap, splitFileName(key)[1], () => [])
            files.push([key, value])
        }
        
    const filesSorted: Array<[string, string]> = []
    for (const files of fileMap.values())
        for (const f of files)
            filesSorted.push(f)

    return [...folders, ...filesSorted]
}

const FileBrowser: React.FC<{
    style?: React.CSSProperties
    filter?: (entry: [string, string | DirTree]) => boolean
    newMenu: Array<ContextMenuOptions>

}> = ({ style, filter, newMenu }) => {

    const [height] = useFileBrowserHeight()
    const [dirTree] = useDirTree()

    const [dirWrapper] = useDir()
    const [dir] = dirWrapper
    const dirEntries = useMemo(() => sortDirEntries(dir), [dirWrapper])
    const dirEntriesFiltered = useMemo(() => filter ? dirEntries.filter(filter) : dirEntries, [dirEntries, filter])
    
    const dirParent = useMemo(() => {
        const location = dir?.["/"]
        if (!location || location === "/" || location === getProjectRootURI()) return

        const parts = getRelativeURI(location).split("/")
        parts.pop()

        if (!parts.length) return dirTree

        const val = get(dirTree, parts) as DirTree | string | undefined
        if (typeof val === "object") return val

    }, [dir, dirTree])

    return(
        <div className="lingo-files flex flex-col" style={{ height, ...style }} onClick={() => setDirSelected("")}>
            <FileToolbar newMenu={newMenu} />
            <div className="flex-grow overflow-y-scroll">
                {dirParent && (
                    <FileButton type="folderUp" target={dirParent}>
                       返回上级
                   </FileButton>
                )}
                {dirEntriesFiltered.map(([key, value]) => (
                    <FileButton
                     key={typeof value === "object" ? value["/"] : value}
                     type={typeof value === "object" ? "folder" : "file"}
                     target={value}
                    >
                        {key}
                    </FileButton>
                ))}
            </div>
            <LoadingMask show={!dirTree || Object.keys(dirTree).length <= 1} />
            <Border />
        </div>
    )
}

export default FileBrowser