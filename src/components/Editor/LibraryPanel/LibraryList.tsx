import { Divider, List } from "@mui/material"
import React from "react"
import Section from "./Section"
import AndroidIcon from "@mui/icons-material/Android"
import makeGameSection from "../../utils/makeGameSection"

const GameSection = makeGameSection(Section)

const LibraryList: React.FC = () => {
    return (
        <List disablePadding dense className="w-full">
            <GameSection />
            <Divider />
            <Section
             label="UI"
             items={[
                 { label: "NavBar", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "Button", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "Screen", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "Text", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "TextField", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "Radio", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "Checkbox", icon: <AndroidIcon fontSize="small" className="opacity-25" /> },
                 { label: "CircularProgress", icon: <AndroidIcon fontSize="small" className="opacity-25" /> }
             ]}
            />
        </List>
    )
}

export default LibraryList