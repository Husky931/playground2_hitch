import React, { useEffect, useState } from "react"
import { BaseNode, useGameEditorGraph } from "../../../../state/useGameEditorGraph"
import CloseSquare from "./CloseSquare"
import MinusSquare from "./MinusSquare"
import PlusSquare from "./PlusSquare"
import { pull, last, isNotNullish } from "@lincode/utils"
import { uuidNodeInstanceMap } from "../../Canvas/GameComponent"
import { useGameEditorSelectionTarget } from "../../../../state/useGameEditorSelectionTarget"
import { emitGameEditorSelectionTarget } from "../../../../events/onGameEditorSelectionTarget"
import { setContextMenu } from "@pinyinma/context-menu"
import { timelineState } from "../../Timeline/TimelineComponent"
import { TreeItem, TreeView } from "@mui/lab"

const recursiveTreeItems = (node: BaseNode | undefined, onIconClick?: (uuid?: string) => void) => {
    if (!node) return undefined

    const handleContextMenu = () => {
        setContextMenu([{
            text: "添加动画",
            onClick: () => {
                timelineState.addLayer(node.uuid, node.name ?? node.type)
                timelineState.addKeyframe(node.uuid, 0)
            }
        }])
        node && emitGameEditorSelectionTarget(node)
    }

    return (
        <TreeItem
         key={node.uuid}
         nodeId={node.uuid}
         label={node.name ?? node.type}
        //  onIconClick={() => onIconClick?.(node.uuid)}
         onContextMenu={handleContextMenu}
        >
            {node.children?.map(childNode => recursiveTreeItems(childNode, onIconClick))}
        </TreeItem>
    )
}

const ScenePanel: React.FC = () => {
    const [{ baseNodes }] = useGameEditorGraph()
    const [expanded, setExpanded] = useState<[Array<string>]>([[]])
    const [{ nodes }] = useGameEditorSelectionTarget()

    useEffect(() => {
        setExpanded([[]])
    }, [baseNodes])

    const toggleExpanded = (uuid?: string) => {
        if (!uuid) return

        const [exp] = expanded

        if (exp.includes(uuid))
            pull(exp, uuid)
        else
            exp.push(uuid)

        setExpanded([exp])
    }

    const handleNodeSelect = (_: any, uuids: Array<string>) => {
        const uuid = last(uuids)
        const found = uuid && uuidNodeInstanceMap.get(uuid)
        found && emitGameEditorSelectionTarget(found.node)
    }

    return (
        <>
            <TreeView
             defaultCollapseIcon={<MinusSquare />}
             defaultExpandIcon={<PlusSquare />}
             defaultEndIcon={<CloseSquare />}
             expanded={expanded[0]}
             onNodeSelect={handleNodeSelect}
             selected={nodes.filter(isNotNullish).map(n => n.uuid)}
             multiSelect
            >
                {baseNodes.map(node => recursiveTreeItems(node, toggleExpanded))}
            </TreeView>
            {!baseNodes.length && (
                <div className="center opacity-25 font-bold">
                    没有创建物体
                </div>
            )}
        </>
    )
}

export default ScenePanel