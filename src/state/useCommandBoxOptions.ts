import store, { createEffect, omit, rename, filter, renameStartsWith } from "@lincode/react-global-state"
import { traverse } from "@lincode/utils"
import fileOpen from "../actions/file/fileOpen"
import { onCommandBoxConfirm } from "../events/onCommandBoxConfirm"
import { onDirDelete } from "../events/onDirDelete"
import { onDirRename } from "../events/onDirRename"
import { onFileDelete } from "../events/onFileDelete"
import { onFileRename } from "../events/onFileRename"
import { RASPBERRY } from "../globals"
import { getDirTree } from "./useDirTree"

const [useCommandBoxOptions, setCommandBoxOptions, getCommandBoxOptions] = store<Record<string, boolean>>({})
export { useCommandBoxOptions }

const omitCommandBoxOptions = omit(setCommandBoxOptions, getCommandBoxOptions)
const renameCommandBoxOptions = rename(setCommandBoxOptions, getCommandBoxOptions)
const filterCommandBoxOptions = filter(setCommandBoxOptions, getCommandBoxOptions)
const renameStartsWithCommandBoxOptions = renameStartsWith(setCommandBoxOptions, getCommandBoxOptions)

!RASPBERRY && createEffect(() => {
    const dirTree = getDirTree()

    if (dirTree) {
        const fileNameRecord: Record<string, boolean> = {}
        traverse(dirTree, (k, _, parent: any) => {
            if (typeof k === "string" && k !== "/")
                fileNameRecord[parent["/"] + "/" + k] = true
        })
        setCommandBoxOptions(fileNameRecord)
        const handle = onCommandBoxConfirm(val => fileOpen(val))

        const handle0 = onFileDelete(location => omitCommandBoxOptions(location))
        const handle1 = onFileRename(([from, to]) => renameCommandBoxOptions(from, to))
        const handle2 = onDirDelete(location => filterCommandBoxOptions((_, k) => !k.startsWith(location)))
        const handle3 = onDirRename(([from, to]) => renameStartsWithCommandBoxOptions(from, to))

        return () => {
            handle.cancel()
            handle0.cancel()
            handle1.cancel()
            handle2.cancel()
            handle3.cancel()
        }
    }
    setCommandBoxOptions({})

}, [getDirTree])