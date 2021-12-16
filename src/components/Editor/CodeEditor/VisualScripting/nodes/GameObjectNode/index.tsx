import React from "react"
import NumberPropertyHandle from "../../propertyHandles/NumberPropertyHandle"
import schema from "@pinyinma/gamelib/lib/display/utils/deserialize/schema"
import BooleanPropertyHandle from "../../propertyHandles/BooleanPropertyHandle"
import StringPropertyHandle from "../../propertyHandles/StringPropertyHandle"
import ColorPropertyHandle from "../../propertyHandles/ColorPropertyHandle"
import { assert } from "@lincode/utils"
import PropertySearch from "./PropertySearch"
import { GameObjectNodeData, GameObjectProperties } from "../../compilePreview/types"
import { refreshVisualScriptingGraph, useVisualScriptingGraph } from "../../../../../../state/useVisualScriptingGraph"

interface GameObjectNodeProps {
    data: GameObjectNodeData
}

const GameObjectNode: React.FC<GameObjectNodeProps> = React.memo(({ data }) => {
    const [graph] = useVisualScriptingGraph()
    
    const targetSchema: GameObjectProperties = schema[data.kind]
    assert(targetSchema)

    return (
        <>
            <div className="p-2 flex opacity-75">
                <div className="bg-yellow-300 text-black font-bold px-4">
                    {data.kind.toUpperCase()}
                </div>
            </div>
            <div className="w-64 bg-black bg-opacity-25 p-4">
                <PropertySearch
                 className="my-2"
                 label="添加属性"
                 options={Object.keys(targetSchema)}
                 validator={(property: string) => {
                    if (!(property in targetSchema))
                        return "属性不存在"
                    
                    if (property in data.properties)
                        return "属性已被添加"
            
                    return "success"
                 }}
                 validatorDebounce={500}
                 onConfirm={(property: string) => {
                    data.properties[property] = targetSchema[property]
                    refreshVisualScriptingGraph()
                 }}
                />
                {Object.entries(data.properties).map(([property, value]) => {
                    const props = {
                        key: property,
                        label: property,
                        isTarget: true,
                        onRemove: () => {
                            delete data.properties[property]
                            refreshVisualScriptingGraph()
                        },
                        onChange: (val: string | number | boolean) => {
                            data.properties[property] = val
                            refreshVisualScriptingGraph()
                        },
                        onChangeCommitted: () => {
                        }
                    }
                    return typeof value === "number" ? (
                        <NumberPropertyHandle {...props} value={value} />
                    ) : typeof value === "boolean" ? (
                        <BooleanPropertyHandle {...props} value={value} />
                    ) : typeof value === "string" ? (
                        property === "color" ? (
                            <ColorPropertyHandle {...props} value={value} />
                        ) : (
                            <StringPropertyHandle {...props} value={value} />
                        )
                    ) : null
                })}
            </div>
        </>
	)
}, () => true)

export default GameObjectNode