import type { GameObjectType } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"

export type GameObjectProperties = Record<string, string | number | boolean>

export type GameObjectNodeData = {
    type: "GameObjectNode"
    kind: GameObjectType
    properties: GameObjectProperties
}

export type ValueNodeData = {
    type: "ValueNode"
    kind: "string" | "number" | "boolean"
}

export type NodeType = "GameObjectNode" | "ValueNode"
export type NodeData = GameObjectNodeData | ValueNodeData