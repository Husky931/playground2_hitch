import React, { useEffect, useRef, useState } from "react"
import ReactFlow, { Edge, FlowTransform, Node } from "react-flow-renderer"
import { setContextMenu } from "@pinyinma/context-menu"
import { setDialog } from "@pinyinma/dialog"
import { setMarkdownEditor } from "../../../state/useMarkdownEditor"
import { nanoid } from "nanoid"
import lessonDialog from "../../../actions/lesson/lessonDialog"
import { getLessonEditor, useLessonEditor } from "../../../state/useLessonEditor"
import { useTruthy } from "@lincode/hooks"
import { decreaseLoadingCount, increaseLoadingCount } from "../../../state/useLoadingCount"
import dedent from "ts-dedent"
import { setLessonEditorHidden } from "../../../state/useLessonEditorHidden"
import { setAssistantOpen } from "../../../state/useAssistantOpen"
import { setAssistantGraph } from "../../../state/useAssistantGraph"
import { setAssistantGraphId } from "../../../state/useAssistantGraphId"
import NodeContent from "./NodeContent"
import { NodeType, SerializedAssistantAction, SerializedEdge, SerializedNode } from "./types"
import { graphql, http } from "../../../utils/http"

const serialize = (nodes: Map<string, Node>, edges: Map<string, Edge>) => {
    const data: Array<SerializedNode | SerializedEdge> = []
    for (const [id, node] of nodes)
        data.push({
            type: "node", id,
            markdown: node.data.markdown,
            action: node.data.action,
            audio: node.data.audio,
            x: node.position.x,
            y: node.position.y
        })
    for (const [id, edge] of edges)
        data.push({
            type: "edge", id,
            label: edge.label as string,
            source: edge.source,
            target: edge.target
        })
    return data
}

const Chart: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const [nodes] = useState(() => new Map<string, Node<NodeType>>())
    const [edges] = useState(() => new Map<string, Edge>())
    const [, render] = useState({})

    const upload = async () => {
        await lessonDialog(serialize(nodes, edges))
        render({})
    }

    const createNode = (
        markdown: string,
        action: SerializedAssistantAction | undefined,
        audio: boolean | undefined,
        x: number,
        y: number,
        id: string
    ) => {
        nodes.set(id, {
            id,
            position: { x, y },
            className: "w-64 p-0",
            data: {
                markdown,
                action,
                audio,
                label: <NodeContent id={id} nodes={nodes} upload={upload} />
            }
        })
    }

    const createEdge = (label: string, source: string, target: string, id: string) => {
        edges.set(id, {
            id,
            source,
            target,
            label
        })
    }

    const [lesson] = useLessonEditor()
    const lessonTruthy = useTruthy(lesson)

    useEffect(() => {
        if (!lessonTruthy) return

        nodes.clear()
        edges.clear()
        render({})

        ;(async () => {
            increaseLoadingCount()
            await new Promise(resolve => setTimeout(resolve, 500))

            try {
                const { data } = await http.get(`/lessons/${lessonTruthy._id}/dialog/data.json`)
                
                if (Array.isArray(data)) {
                    for (const item of data as Array<SerializedNode | SerializedEdge>)
                        if (item.type === "node")
                            createNode(item.markdown, item.action, item.audio, item.x, item.y, item.id)
                        else if (nodes.has(item.source) && nodes.has(item.target))
                            createEdge(item.label, item.source, item.target, item.id)

                    render({})
                }
                decreaseLoadingCount()
            }
            catch {
                decreaseLoadingCount()
            }
        })()
    }, [lessonTruthy])

    const flowTransform = useRef<FlowTransform>({ x: 0, y: 0, zoom: 1 })

    return (
        <div style={style}>
            <ReactFlow
             elements={[...nodes.values(), ...edges.values()]}
             onMoveEnd={e => flowTransform.current = e ?? { x: 0, y: 0, zoom: 1 }}
             onPaneContextMenu={e => {
                setContextMenu([{
                    text: "新建节点",
                    onClick: () => {
                        const { x, y, zoom } = flowTransform.current
                        createNode(
                            "双击卡片编辑内容",
                            undefined,
                            undefined,
                            (e.clientX - x) / zoom,
                            (e.clientY - y) / zoom,
                            nanoid()
                        )
                        upload()
                    }
                }])
             }}
             onConnect={({ source, target }) => {
                if (!source || !target) return
        
                createEdge("继续", source, target, nanoid())
                upload()
             }}
             onNodeDoubleClick={(_, n) => {
                setMarkdownEditor({
                    markdown: n.data.markdown,
                    onConfirm: async markdown => {
                        nodes.set(n.id, {
                            ...n,
                            data: {
                                ...n.data,
                                markdown,
                                label: <NodeContent id={n.id} nodes={nodes} upload={upload} />
                            }
                        })
                        await upload()
                    }
                })
             }}
             onEdgeDoubleClick={(_, e) => {
                setDialog({
                    message: "内容",
                    prompt: true,
                    onConfirm: async label => {
                        edges.set(e.id, { ...e, label })
                        await upload()
                    }
                })
             }}
             onNodeContextMenu={(e, node) => {
                e.stopPropagation()
                e.preventDefault()

                setContextMenu([
                    {
                        text: "删除节点",
                        onClick: () => setDialog({
                            message: "确定要删除吗？",
                            onConfirm: async () => {
                                nodes.delete(node.id)

                                for (const edge of edges.values())
                                    if (edge.source === node.id  || edge.target === node.id)
                                        edges.delete(edge.id)

                                await upload()

                                const lesson = getLessonEditor()
                                if (!lesson) return

                                try {
                                    await graphql(dedent`
                                        mutation {
                                            lessonDialog(_id: "${lesson._id}", fileName: "${node.id}.mp3", delete: true) {
                                                recordId
                                            }
                                        }
                                    `)
                                }
                                catch {}
                            }
                        })
                    }, {
                        text: "测试节点",
                        onClick: () => {
                            setLessonEditorHidden(true)
                            setAssistantOpen(true)
                            setAssistantGraph(serialize(nodes, edges))
                            setAssistantGraphId(node.id)
                        }
                    }
                ])
             }}
             onEdgeContextMenu={(e, edge) => {
                e.stopPropagation()
                e.preventDefault()

                setContextMenu([{
                    text: "删除边缘",
                    onClick: () => setDialog({
                        message: "确定要删除吗？",
                        onConfirm: async () => {
                            edges.delete(edge.id)
                            await upload()
                        }
                    })
                }])
             }}
             onNodeDragStop={(_, n) => {
                nodes.set(n.id, n)
                upload()
             }}
            />
        </div>
    )
}

export default Chart