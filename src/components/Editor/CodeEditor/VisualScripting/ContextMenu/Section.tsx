import { ListItem, ListItemIcon, ListItemText, Collapse } from "@mui/material"
import React from "react"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { setContextMenu } from "@pinyinma/context-menu"
import { useVisualScriptingContextMenuExpanded } from "../../../../../state/useVisualScriptingContextMenuExpanded"
import { SectionProps } from "../../../../utils/makeGameSection"

const Section: React.FC<SectionProps> = ({ label, items }) => {
    const [expanded, setExpanded] = useVisualScriptingContextMenuExpanded()
    const open = expanded === label

    return (
        <>
            <ListItem button onClick={() => setExpanded(open ? "" : label)} className="opacity-75">
                <ListItemIcon style={{ minWidth: 40 }}>
                    {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </ListItemIcon>
                <ListItemText primary={label} />
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {items.map(({ label, icon, onClick }) => (
                    <ListItem
                     key={label}
                     button
                     onClick={() => (onClick?.(), setContextMenu(undefined))}
                    >
                        {icon && <ListItemIcon style={{ minWidth: 40 }}>{icon}</ListItemIcon>}
                        <ListItemText primary={label} />
                    </ListItem>
                ))}
            </Collapse>
        </>
    )
}

export default Section