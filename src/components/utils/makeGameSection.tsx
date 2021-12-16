import { upperFirst } from "@lincode/utils"
import React from "react"
import makePrimitiveIcons from "./makePrimitiveIcons"
import type { GameObjectType } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"

export interface SectionProps {
    label: string
    items: Array<{ label: string, icon?: JSX.Element, onClick?: () => void }>
}

export default (Section: React.FC<SectionProps>) => {
    const GameSection: React.FC<{ onClick?: (kind: GameObjectType) => void }> = ({ onClick }) => {
        return (
            <Section
             label="3D"
             items={makePrimitiveIcons().map(([kind, icon]) => ({
                 label: upperFirst(kind),
                 icon,
                 onClick: () => onClick?.(kind as GameObjectType)
             }))}
            />
        )
    }
    return GameSection
}