import { List, ListItem, ListItemSecondaryAction, IconButton, Button, ButtonGroup } from "@mui/material"
import React, { useEffect, useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import dedent from "ts-dedent"
import { setDialog } from "@pinyinma/dialog"
import { getLessonEditor } from "../../../state/useLessonEditor"
import useAudioRecorder from "./useAudioRecorder"
import { NodeType } from "./types"
import { Node } from "react-flow-renderer"
import { nanoid } from "nanoid"
import Markdown from "../../Markdown"
import { setMarkdownEditor } from "../../../state/useMarkdownEditor"
import { graphqlUpload, graphql, baseURL } from "../../../utils/http"

const NodeContent: React.FC<{
    id: string, nodes: Map<string, Node<NodeType>>, upload: () => Promise<void>

}> = ({ id, nodes, upload }) => {
    
    const [, render] = useState({})
    const nodeData = nodes.get(id)!.data!

    const [start, stop, recording, src, setSrc] = useAudioRecorder(async blob => {
        const lesson = getLessonEditor()
        if (!lesson) return

        await graphqlUpload(blob, dedent`
            mutation ($file: Upload!) {
                lessonDialog(_id: "${lesson._id}", file: $file, fileName: "${id}.mp3") {
                    recordId
                }
            }
        `)
        nodeData.audio = true
        await upload()
        render({})
    })

    const handleRecord = () => {
        if (recording) {
            stop()
            return
        }
        start()
    }

    const handleDelete = () => {
        setDialog({
            message: "确定要删除当前录音吗？",
            onConfirm: async () => {
                const lesson = getLessonEditor()
                if (!lesson) return

                try {
                    await graphql(dedent`
                        mutation {
                            lessonDialog(_id: "${lesson._id}", fileName: "${id}.mp3", delete: true) {
                                recordId
                            }
                        }
                    `)
                }
                catch {}

                nodeData.audio = false                
                await upload()
                setSrc("")
            }
        })
    }

    useEffect(() => {
        const lesson = getLessonEditor()
        if (!lesson || !nodeData.audio) {
            setSrc("")
            return
        }
        setSrc(`${baseURL}/lessons/${lesson._id}/dialog/${id}.mp3`)
        
    }, [nodeData.audio])

    const handleEditHighlight = () => {
        setDialog({
            message: "高亮元素",
            prompt: true,
            onConfirm: async selector => {
                (nodeData.action ??= {}).highlight = { selector, clickable: true }
                await upload()
                render({})
            }
        })
    }

    const handleEditPreviewCode = () => {
        setMarkdownEditor({
            markdown: nodeData.action?.previewCode,
            onConfirm: async markdown => {
                (nodeData.action ??= {}).previewCode = markdown
                await upload()
                render({})
            }
        })
    }

    return (
        <List>
            <ListItem>
                <Markdown>{nodeData.markdown}</Markdown>
            </ListItem>
            {/* <ListItem>
                <ListItemText secondary={nodeData.action?.highlight?.selector ?? "高亮元素"} />
                <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={handleEditHighlight}>
                        <EditIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem> */}
            <ListItem>
                <ButtonGroup fullWidth>
                    <Button
                     color={nodeData.action?.highlight?.selector ? "primary" : "secondary"}
                     onClick={handleEditHighlight}
                    >
                        高亮元素
                    </Button>
                    <Button
                     color={nodeData.action?.previewCode ? "primary" : "secondary"}
                     onClick={handleEditPreviewCode}
                    >
                        预览代码
                    </Button>
                </ButtonGroup>
            </ListItem>
            {src ? (
                <ListItem>
                    <audio src={src + `?version=${nanoid()}`} controls />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" size="small" onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ) : (
                <ListItem>
                    <Button
                     variant="contained"
                     color="secondary"
                     fullWidth
                     onClick={handleRecord}
                    >
                        {recording ? "停止" : "录音"}
                    </Button>
                </ListItem>
            )}
        </List>
    )
}

export default NodeContent