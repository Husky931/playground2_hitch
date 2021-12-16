import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import React from "react"
import { BaseNode } from "../../../../state/useGameEditorGraph"
import BasePanel from "./BasePanel"
import { propertiesFolder } from "./folderNames"
import makeValue from "./makeValue"

interface ModelPanelProps {
    t: SimpleObjectManager
    nodes: Array<BaseNode | undefined>
}

const ModelPanel: React.FC<ModelPanelProps> = ({ t, nodes }) => {
    return (
        <BasePanel t={t} nodes={nodes} config={{
            "文件 src": makeValue(t, nodes, "src", "", propertiesFolder)
        }} />
    )
}

export default ModelPanel