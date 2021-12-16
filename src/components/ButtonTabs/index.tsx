import React, { useEffect, useState } from "react"
import { ButtonGroup, Button } from "@mui/material"

interface ButtonTabsProps {
    tabs: Record<string, () => void>
    className?: string
    style?: React.CSSProperties
    labelColor?: string
}

const ButtonTabs: React.FC<ButtonTabsProps> = ({ tabs, className, style, labelColor }) => {
    const labels = Object.keys(tabs)
    const [selected, setSelected] = useState(labels[0])

    useEffect(() => {
        tabs[selected]()
    }, [selected])

    return (
        <ButtonGroup fullWidth size="small" className={className} style={style}>
            {labels.map((label, i) => (
                <Button
                 key={i}
                 style={{ background: label === selected ? "rgba(100,100,255,0.25)" : undefined, color: labelColor }}
                 onClick={() => setSelected(label)}
                >
                    {label}
                </Button>
            ))}
        </ButtonGroup>
    )
}

export default ButtonTabs