import React from "react"
import { useGameEditorSelectionTarget } from "../../../../state/useGameEditorSelectionTarget"
import BasePanel from "./BasePanel"
import isMultipleSelectionGroup from "../../utils/isMultipleSelectionGroup"
import ModelPanel from "./ModelPanel"
import PrimitivePanel from "./PrimitivePanel"

const Panel: React.FC = () => {
    const [{ instance: t, nodes }] = useGameEditorSelectionTarget()
    const [node] = nodes

    if (!t || !node)
        return (
            <div className="center opacity-25 font-bold">
                没有被选中的物体
            </div>
        )

    const { type } = node

    if (isMultipleSelectionGroup(t) && nodes.some(n => n?.type !== type))
        return <BasePanel key={t.outerObject3d.uuid} t={t} nodes={nodes} />

    if (type === "group" || type === "reflector")
        return <BasePanel key={t.outerObject3d.uuid} t={t} nodes={nodes} />

    if (type === "model" || type === "scene")
        return <ModelPanel key={t.outerObject3d.uuid} t={t} nodes={nodes} />

    return <PrimitivePanel key={t.outerObject3d.uuid} t={t} nodes={nodes} />

}

const PropertiesPanel: React.FC = () => {    
    return (
        <div className="px-2 overflow-y-scroll flex-grow">
            <Panel />
        </div>
    )
}

export default PropertiesPanel