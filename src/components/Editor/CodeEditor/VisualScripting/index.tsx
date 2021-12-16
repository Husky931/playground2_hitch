import { setContextMenu } from "@pinyinma/context-menu"
import { nanoid } from "nanoid"
import React, { useRef } from "react"
import ReactFlow, { FlowTransform } from "react-flow-renderer"
import GameObjectNode from "./nodes/GameObjectNode"
import ContextMenu from "./ContextMenu"
import ValueNode from "./nodes/ValueNode"
import { NodeData } from "./compilePreview/types"
import { refreshVisualScriptingGraph, useVisualScriptingGraph } from "../../../../state/useVisualScriptingGraph"

type EdgeParams = { source: any, sourceHandle?: any, target: any, targetHandle?: any }

interface VisualScriptingProps {
    className?: string
}

const VisualScripting: React.FC<VisualScriptingProps> = React.memo(({ className }) => {
    const [graph] = useVisualScriptingGraph()
    const flowTransform = useRef<FlowTransform>({ x: 0, y: 0, zoom: 1 })
    const elRef = useRef<HTMLDivElement>(null)

    const commitChange = async () => {
        refreshVisualScriptingGraph()
    }

    const pushNode = (x: number, y: number, data: NodeData) => {
        graph.nodes.push({
            id: nanoid(),
            type: data.type,
            position: { x, y },
            data
        })
    }

    const pushEdge = (params: EdgeParams) => {
        graph.edges.push({
            ...params,
            id: nanoid()
        })
    }
    
    return (
        <div className={className} ref={elRef}>
            <ReactFlow
             nodeTypes={{ GameObjectNode, ValueNode }}
             elements={[...graph.nodes, ...graph.edges]}
             onMoveEnd={e => flowTransform.current = e ?? { x: 0, y: 0, zoom: 1 }}
             onPaneContextMenu={e => setContextMenu(
                <ContextMenu createNode={data => {
                    const { x, y, zoom } = flowTransform.current
                    const { left, top } = elRef.current!.getBoundingClientRect()
                    pushNode(
                        (e.clientX - x - left) / zoom,
                        (e.clientY - y - top) / zoom,
                        data
                    )
                    commitChange()
                }} />
             )}
             onConnect={params => {
                pushEdge(params)
                commitChange()
             }}
            />
        </div>
    )
})

export default VisualScripting