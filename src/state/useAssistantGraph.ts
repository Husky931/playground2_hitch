import { SerializedEdge, SerializedNode } from "../components/LessonEditor/Chart/types"
import autoResetStore from "./utils/autoResetStore"
import { setAssistantShow } from "./useAssistantShow"

export const [useAssistantGraph, setAssistantGraph, getAssistantGraph] = autoResetStore<Array<SerializedNode | SerializedEdge> | undefined>(undefined)

getAssistantGraph(graph => setAssistantShow(!!graph))