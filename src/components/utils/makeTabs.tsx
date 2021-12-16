import React, { useEffect, useState } from "react"
import ErrorIcon from "@mui/icons-material/Error"
import CancelIcon from "@mui/icons-material/Cancel"
import { UseGlobalState } from "@lincode/react-global-state"
import { CircularProgress } from "@mui/material"
import { AppBar, Tabs, Tab, IconButton } from "@mui/material"
import { setDialog } from "@pinyinma/dialog"
import { useFileUnsaved, getFileUnsaved, omitFileUnsaved } from "../../state/useFileUnsaved"
import { useFileUpdating } from "../../state/useFileUpdating"
import { Border, Transition } from "@pinyinma/components"

export default (
    useFileTabs: UseGlobalState<Array<string>>,
    pullFileTabs: (val: string) => void,
    useFileTab: UseGlobalState<string | undefined>
) => {
    const CloseCircle: React.FC<{ f: string }> = ({ f }) => {
        const [fileUnsaved] = useFileUnsaved()

        return (
            fileUnsaved[f] ? (
                <ErrorIcon fontSize="inherit" />
            ) : (
                <CancelIcon fontSize="inherit" />
            )
        )
    }

    const SaveProgress: React.FC<{ f: string }> = ({ f }) => {
        const [fileUpdating] = useFileUpdating()
    
        return (
            <Transition show={fileUpdating[f]} duration={1000}>
                {state => (
                    <div className="w-6 h-6 absolute transition-opacity duration-1000" style={{
                        opacity: state === "beforeEnter" || state === "enter" ? 1 : 0
                    }}>
                        <CircularProgress color="inherit" className="w-6 h-6 absfull" />
                    </div>
                )}
            </Transition>
        )
    }

    const handleClose = async (f: string) => {
        if (f in getFileUnsaved()) {
            await new Promise<void>(resolve => setDialog({
                message: "文件未保存，是否继续关闭？",
                onConfirm: () => resolve()
            }))
            omitFileUnsaved(f)
        }
        pullFileTabs(f)
    }

    const FileTabs: React.FC<{ style?: React.CSSProperties, delay?: number }> = ({ style, delay }) => {
        const [fileTabs] = useFileTabs()
        const [fileTab, setFileTab] = useFileTab()
        const [showTabs, setShowTabs] = useState(!delay)
    
        useEffect(() => {
            delay && setTimeout(() => setShowTabs(true), delay)
        }, [])

        return (
            <AppBar position="relative" color="transparent" elevation={0} style={style}>
                <Tabs
                 value={fileTab ? Math.max(fileTabs.indexOf(fileTab), 0) : 0}
                 variant="scrollable"
                 scrollButtons="auto"
                 style={{ height: 48 }}
                >
                    {showTabs && fileTabs.map(f => (
                        <Tab key={f} component="div" onClick={() => setFileTab(f)} label={
                            <div className="flex items-center">
                                <div className="truncate" style={{ minWidth: 80, maxWidth: 140 }}>
                                    {f.split("/").pop()}
                                </div>
                                <IconButton
                                 className="translate-x-3"
                                 size="small"
                                 onClick={e => (e.stopPropagation(), handleClose(f))}
                                >
                                    <CloseCircle f={f} />
                                    <SaveProgress f={f} />
                                </IconButton>
                            </div>
                        } />
                    ))}
                </Tabs>
                <Border />
                <Border horizontal />
            </AppBar>
        )
    }

    return FileTabs
}