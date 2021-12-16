import { Resolvable } from "@lincode/promiselikes"
import { getDirTree } from "../useDirTree"

const dirTreeReady = [new Resolvable()]
export default dirTreeReady

getDirTree(dirTree => {
    if (!dirTree && dirTreeReady[0].done)
        dirTreeReady[0] = new Resolvable()
    else if (dirTree && !dirTreeReady[0].done)
        dirTreeReady[0].resolve()
})