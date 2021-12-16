import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import { useEffect } from "react"
import { onGameEditorTransformControls } from "../../../../events/onGameEditorTransformControls"
import { userUpdateBaseNode } from "../../../../state/useGameEditorGraph"
import { useGameEditorSelectionTarget } from "../../../../state/useGameEditorSelectionTarget"
import isMultipleSelectionGroup from "../../utils/isMultipleSelectionGroup"
import { nodeInstanceMap } from "../GameComponent"
import { queueMultipleSelectionTransform } from "./useMultipleSelection"

export const pickTransformRecord = (t: SimpleObjectManager) => ({
    x: t.x, y: t.y, z: t.z,
    width: t.width, height: t.height, depth: t.depth,
    scaleX: t.scaleX, scaleY: t.scaleY, scaleZ: t.scaleZ,
    rotationX: t.rotationX, rotationY: t.rotationY, rotationZ: t.rotationZ, 
})

export default () => {
    const [{ instance, nodes }] = useGameEditorSelectionTarget()
    
    useEffect(() => {
        const t = instance
        if (!t) return
        
        if (isMultipleSelectionGroup(t)) {
            const handle = onGameEditorTransformControls(val => {
                if (val !== "stop") return
                
                for (const node of nodes) {
                    const t = node && nodeInstanceMap.get(node)
                    t && queueMultipleSelectionTransform(node, t)
                }
            })
            return () => {
                handle.cancel()
            }
        }
        else {
            const [node] = nodes
            if (!node) return

            const handle = onGameEditorTransformControls(val => {
                val === "stop" && userUpdateBaseNode(node, pickTransformRecord(t))
            })
            return () => {
                handle.cancel()
            }
        }
    }, [nodes, instance])
}