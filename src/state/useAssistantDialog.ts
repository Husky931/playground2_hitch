import { createEffect } from "@lincode/react-global-state"
import { SerializedEdge } from "../components/LessonEditor/Chart/types"
import autoResetStore from "./utils/autoResetStore"
import { getAssistantGraph } from "./useAssistantGraph"
import { getAssistantGraphId } from "./useAssistantGraphId"
import { getAssistantGraphNode } from "./useAssistantGraphNode"
import { setAssistantHighlight } from "./useAssistantHighlight"
import { getLessonEditor } from "./useLessonEditor"
import { baseURL } from "../utils/http"

export const [useAssistantDialog, setAssistantDialog, getAssistantDialog] = autoResetStore<{
    message: string
    choices: Array<{ label: string, nextId?: string, onClick?: () => void }>
    audio?: string
}>({
    message: "你好，欢迎来到 lingo！",
    choices: [{ label: "我知道了" }]
})

createEffect(() => {
    const graph = getAssistantGraph()
    const id = getAssistantGraphId()
    const node = getAssistantGraphNode()
    const lesson = getLessonEditor()
    if (!graph || !id || !node || !lesson) return

    const edges = graph.filter((i): i is SerializedEdge => i.type === "edge")

    setAssistantDialog({
        message: node.markdown,
        choices: edges.filter(e => e.source === node.id).map(e => ({
            label: e.label,
            nextId: e.target
        })),
        audio: node.audio ? `${baseURL}/lessons/${lesson._id}/dialog/${id}.mp3` : undefined
    })
    setAssistantHighlight(node.action?.highlight)

}, [getAssistantGraph, getAssistantGraphId, getAssistantGraphNode, getLessonEditor])