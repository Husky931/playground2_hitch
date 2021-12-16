import store, { createEffect, rename, renameStartsWith } from "@lincode/react-global-state"
import { DirTree } from "@pinyinma/datatypes"
import { onDirDelete } from "../events/onDirDelete"
import { onDirRename } from "../events/onDirRename"
import { onFileDelete } from "../events/onFileDelete"
import { onFileRename } from "../events/onFileRename"
import { getDir } from "./useDir"

const [useDirSelected, setDirSelected, getDirSelected] = store<string | DirTree>("")
export { useDirSelected, setDirSelected }

const renameDirSelected = rename(setDirSelected, getDirSelected)
const renameStartsWithDirSelected = renameStartsWith(setDirSelected, getDirSelected)

onFileDelete(() => setDirSelected(""))
onFileRename(([from, to]) => renameDirSelected(from, to))
onDirDelete(() => setDirSelected(""))
onDirRename(([from, to]) => renameStartsWithDirSelected(from, to))

createEffect(() => {
    const [dir] = getDir()

    createEffect(() => {
        setDirSelected("")
    }, [dir])

}, [getDir])