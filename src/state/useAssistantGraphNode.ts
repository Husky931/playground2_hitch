import { SerializedNode } from "../components/LessonEditor/Chart/types"
import store, { createEffect } from "@lincode/react-global-state"
import { getAssistantGraph } from "./useAssistantGraph"
import { getAssistantGraphId } from "./useAssistantGraphId"

const [, setAssistantGraphNode, getAssistantGraphNode] = store<SerializedNode | undefined>(undefined)
export { getAssistantGraphNode }

createEffect(() => {
    const graph = getAssistantGraph()
    const id = getAssistantGraphId()
    
    const node = graph?.find(item => item.id === id)
    setAssistantGraphNode(node?.type === "node" ? node : undefined)
        
}, [getAssistantGraph, getAssistantGraphId])