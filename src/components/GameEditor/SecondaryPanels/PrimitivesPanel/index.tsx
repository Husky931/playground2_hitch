import { List } from "@mui/material"
import { nanoid } from "nanoid"
import React from "react"
import { userAddBaseNode } from "../../../../state/useGameEditorGraph"
import makeGameSection from "../../../utils/makeGameSection"
import Section from "./Section"

const GameSection = makeGameSection(Section)

const PrimitivesPanel: React.FC = () => {
    return (
        <List disablePadding dense className="w-full">
            <GameSection onClick={type => userAddBaseNode({ type, uuid: nanoid() })} />
        </List>
    )
}

export default PrimitivesPanel