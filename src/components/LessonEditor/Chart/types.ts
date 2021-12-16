import { AssistantHighlight } from "../../../state/useAssistantHighlight"

type NodeData = {
    markdown: string
    action: SerializedAssistantAction | undefined
    audio: boolean | undefined
}

export type NodeType = NodeData & {
    label: JSX.Element
}

export type SerializedAssistantAction = {
    highlight?: AssistantHighlight
    previewCode?: string
}

export type SerializedNode = NodeData & {
    type: "node"
    id: string
    x: number
    y: number
}

export type SerializedEdge = {
    type: "edge"
    id: string
    label: string
    source: string
    target: string
}