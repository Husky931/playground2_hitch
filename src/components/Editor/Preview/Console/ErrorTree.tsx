import React, { useState, useRef, useEffect } from "react"
import { TreeView, TreeItem } from "@mui/lab"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useCodeErrors } from "../../../../state/useCodeErrors"
import CancelIcon from "@mui/icons-material/CancelOutlined"
import { Container } from "@mui/material"
import { getAbsoluteURI, getRelativeURI } from "../../../../utils/uriGetters"
import { controls } from "../../CodeEditor/Code"
import fileOpen from "../../../../actions/file/fileOpen"
import TreeTransition from "../../../TreeTransition"

const ErrorTree: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const [codeErrors] = useCodeErrors()
    const [expanded, setExpanded] = useState(Object.keys(codeErrors))

    const codeErrorsRef = useRef(codeErrors)

    useEffect(() => {
        if (codeErrorsRef.current === codeErrors)
            return

        const expandedNew: Array<string> = []
        for (const [key, value] of Object.entries(codeErrors))
            if (JSON.stringify(codeErrorsRef.current[key]) !== JSON.stringify(value))
                expandedNew.push(key)

        setExpanded([...expanded, ...expandedNew])
        codeErrorsRef.current = codeErrors
        
    }, [expanded, codeErrors])

    return (
        <Container className="flex-grow pb-6 overflow-y-scroll" style={style}>
            <TreeView
             defaultCollapseIcon={<ExpandMoreIcon />}
             defaultExpandIcon={<ChevronRightIcon />}
             expanded={expanded}
             onNodeToggle={(_, nodes) => setExpanded(nodes)}
            >
                {Object.entries(codeErrors).map(([uri, errors]) => (
                    <TreeItem key={uri} nodeId={uri} TransitionComponent={TreeTransition} label={
                        <div className="opacity-75">
                            {"文件名：" + getRelativeURI(uri)}
                        </div>
                    }>
                        {errors.sort((a, b) => a.token.line - b.token.line).map(o => (
                            <TreeItem
                             key={o.message}
                             nodeId={o.message}
                             TransitionComponent={TreeTransition}
                             onClick={() => controls.jumpTo(getAbsoluteURI(uri), o.token.line, fileOpen)}
                             label={
                                <div className="flex">
                                    <CancelIcon fontSize="small" className="mr-2 text-red-500" />
                                    <div className="opacity-75 overflow-hidden">
                                        {o.message}
                                    </div>
                                </div>
                             }
                            />
                        ))}
                    </TreeItem>
                ))}
            </TreeView>
        </Container>
    )
}

export default ErrorTree