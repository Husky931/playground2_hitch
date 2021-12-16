import { omitDeep } from "@lincode/utils"
import { useEffect } from "react"
import { userAddBaseNode, userAddBaseNodes, userRemoveBaseNodes } from "../../../../state/useGameEditorGraph"
import { useGameEditorSelectionTarget } from "../../../../state/useGameEditorSelectionTarget"
import { flushMultipleSelectionTransform } from "./useMultipleSelection"

export default () => {
    const [{ nodes }] = useGameEditorSelectionTarget()

    useEffect(() => {
        if (!nodes.length) return

        const cb = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement) return

            if (e.key === "Backspace")
                userRemoveBaseNodes(nodes)
            else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "c")
                if (nodes.length === 1)
                    nodes[0] && userAddBaseNode(omitDeep(nodes[0], ["uuid", "parent"]))
                else {
                    flushMultipleSelectionTransform()
                    queueMicrotask(() => userAddBaseNodes(nodes.map(node => node && omitDeep(node, ["uuid", "parent"]))))
                }
        }
        document.addEventListener("keydown", cb)
        
        return () => {
            document.removeEventListener("keydown", cb)
        }
    }, [nodes])
}