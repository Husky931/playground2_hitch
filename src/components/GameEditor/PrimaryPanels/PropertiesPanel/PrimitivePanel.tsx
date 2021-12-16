import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import React from "react"
import { BaseNode } from "../../../../state/useGameEditorGraph"
import colorToHex from "../../../../utils/colorToHex"
import BasePanel from "./BasePanel"
import { displayFolder, textureFolder } from "./folderNames"
import makeValue from "./makeValue"

interface PrimitivePanelProps {
    t: SimpleObjectManager
    nodes: Array<BaseNode | undefined>
}

const PrimitivePanel: React.FC<PrimitivePanelProps> = ({ t, nodes }) => {
    return (
        <BasePanel t={t} nodes={nodes} config={{
            "颜色 color": makeValue(t, nodes, "color", "white", displayFolder, { format: colorToHex }),
            "透明 opacity": makeValue(t, nodes, "opacity", 1, displayFolder, { min: 0, max: 1 }),
            "距离雾 fog": makeValue(t, nodes, "fog", true, displayFolder),
            "材质 texture": makeValue(t, nodes, "texture", "", textureFolder),
            "粗糙贴图 roughnessMap": makeValue(t, nodes, "roughnessMap", "", textureFolder),
            "粗糙度 roughness": makeValue(t, nodes, "roughness", 1, textureFolder, { min: 0, max: 1 }),
            "金属贴图 metalnessMap": makeValue(t, nodes, "metalnessMap", "", textureFolder),
            "金属度 metalness": makeValue(t, nodes, "metalness", 0, textureFolder, { min: 0, max: 1 }),
            "凹凸贴图 bumpMap": makeValue(t, nodes, "bumpMap", "", textureFolder),
            "反射贴图 envMap": makeValue(t, nodes, "envMap", "", textureFolder)
        }} />
    )
}

export default PrimitivePanel