import store from "@lincode/react-global-state"
import { DirTree } from "@pinyinma/datatypes"
import { getDirTree } from "./useDirTree"

export const [useDir, setDir, getDir] = store<[DirTree | undefined]>([undefined])

getDirTree(dirTree => setDir([dirTree]))