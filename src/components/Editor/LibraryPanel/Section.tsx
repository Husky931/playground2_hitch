import { ListItem, ListItemIcon, ListItemText, Collapse } from "@mui/material"
import React, { useState } from "react"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { SectionProps } from "../../utils/makeGameSection"

const Section: React.FC<SectionProps> = ({ label, items }) => {
    const [expanded, setExpanded] = useState(true)

    return (
        <>
            <ListItem button onClick={() => setExpanded(!expanded)} className="opacity-75">
                <ListItemIcon style={{ minWidth: 40 }}>
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
            <Collapse in={expanded} timeout="auto">
                {items.map(({ label, icon, onClick }) => (
                    <ListItem key={label} button onClick={onClick}>
                        {icon && <ListItemIcon style={{ minWidth: 40 }}>{icon}</ListItemIcon>}
                        <ListItemText primary={label} />
                    </ListItem>
                ))}
                <div className="h-4" />
            </Collapse>
        </>
    )
}

export default Section