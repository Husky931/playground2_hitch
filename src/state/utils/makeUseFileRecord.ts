import { assign, filter, omit, rename, renameStartsWith } from "@lincode/react-global-state"
import { onFileDelete } from "../../events/onFileDelete"
import { onDirDelete } from "../../events/onDirDelete"
import { onFileRename } from "../../events/onFileRename"
import { onDirRename } from "../../events/onDirRename"
import autoResetStore from "./autoResetStore"

export default <T>() => {
    const [useFileStore, setFileStore, getFileStore] = autoResetStore<Record<string, T>>({})
    const assignFileStore = assign(setFileStore, getFileStore)
    const omitFileStore = omit(setFileStore, getFileStore)
    const filterFileStore = filter(setFileStore, getFileStore)
    const renameFileStore = rename(setFileStore, getFileStore)
    const renameStartsWithFileStore = renameStartsWith(setFileStore, getFileStore)

    onFileDelete(location => omitFileStore(location))
    onFileRename(([from, to]) => renameFileStore(from, to))
    onDirDelete(location => filterFileStore((_, k) => !k.startsWith(location)))
    onDirRename(([from, to]) => renameStartsWithFileStore(from, to))

    return <const>[useFileStore, setFileStore, getFileStore, assignFileStore, omitFileStore]
}