import { forceGet } from "@lincode/utils"
import React, { useEffect, useState } from "react"
import { Connection, Node } from "react-flow-renderer"
import { getVisualScriptingGraph, refreshVisualScriptingGraph } from "../../../../../../state/useVisualScriptingGraph"
import { NodeData, ValueNodeData } from "../../compilePreview/types"
import BooleanPropertyHandle from "../../propertyHandles/BooleanPropertyHandle"
import NumberPropertyHandle from "../../propertyHandles/NumberPropertyHandle"
import StringPropertyHandle from "../../propertyHandles/StringPropertyHandle"

interface ValueNodeProps {
    data: ValueNodeData
}

const ValueNode: React.FC<ValueNodeProps> = React.memo(({ data }) => {
    const [value, setValue] = useState<any>()
    const [targets, setTargets] = useState(() => [new Map<Node<NodeData>, Array<string>>()])
    
    useEffect(() => {
        if (value === undefined || targets[0].size === 0) return

        let refresh = false
        for (const [targetNode, properties] of targets[0]) {
            if (targetNode.data?.type !== "GameObjectNode") continue

            for (const property of properties) {
                targetNode.data.properties[property] = value
                refresh = true
            }
        }
        refresh && refreshVisualScriptingGraph()

    }, [value, targets])

    const props = {
        label: "value",
        isTarget: false,
        onChange: (val: string | number | boolean) => {
            setValue(val)
        },
        onChangeCommitted: () => {
            for (const [targetNode, properties] of targets[0]) {
                if (targetNode.data?.type !== "GameObjectNode") continue
            }
        },
        onConnect: (connection: Connection) => {
            const targetNode = getVisualScriptingGraph().nodes.find(n => n.id === connection.target)
            if (targetNode?.data?.type === "GameObjectNode") {
                const property = connection.targetHandle
                if (!property) return
                
                setValue(targetNode.data.properties[property])
                forceGet(targets[0], targetNode, () => []).push(property)
                setTargets([targets[0]])
            }
        }
    }

    return (
        <>
            <div className="p-2 flex opacity-75">
                <div className="bg-blue-900 text-white font-bold px-4">
                    {data.kind.toUpperCase()}
                </div>
            </div>
            <div className="w-64 bg-black bg-opacity-25 p-4">
                {data.kind === "string" ? (
                    <StringPropertyHandle {...props} value={value ?? ""} />
                ) : data.kind === "number" ? (
                    <NumberPropertyHandle {...props} value={value ?? 0} />
                ) : data.kind === "boolean" ? (
                    <BooleanPropertyHandle {...props} value={value ?? false} />
                ) : null}
            </div>
        </>
	)
}, () => true)

export default ValueNode