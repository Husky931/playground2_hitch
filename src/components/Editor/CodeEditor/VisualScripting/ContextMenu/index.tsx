import { Divider, List } from "@mui/material"
import React from "react"
import Section from "./Section"
import { NodeData } from "../compilePreview/types"
import makeGameSection from "../../../../utils/makeGameSection"

const GameSection = makeGameSection(Section)

const ContextMenu: React.FC<{ createNode: (data: NodeData) => void }> = ({ createNode }) => {
    return (
        <List disablePadding dense className="w-64">
            <GameSection onClick={kind => createNode({ type: "GameObjectNode", kind, properties: {} })} />
            <Divider />
            <Section
             label="values"
             items={[
                { label: "string", onClick: () => createNode({ type: "ValueNode", kind: "string" }) },
                { label: "number", onClick: () => createNode({ type: "ValueNode", kind: "number" }) },
                { label: "boolean", onClick: () => createNode({ type: "ValueNode", kind: "boolean" }) }
             ]}
            />
        </List>
    )
}

export default ContextMenu