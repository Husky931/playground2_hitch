import { AppBar, Toolbar, Button } from "@mui/material"
import React from "react"
import CancelIcon from "@mui/icons-material/Cancel"
import SaveIcon from "@mui/icons-material/Save"
import { assignModelViewer, useModelViewer } from "../../state/useModelViewer"
import { useTruthy } from "@lincode/hooks"
import compress from "browser-image-compression"
import saveBlob from "save-blob"
import blobToFile from "../../utils/blobToFile"
import { getModelViewerPlayer } from "../../state/useModelViewerPlayer"
import ImageQualitySlider from "../ImageQualitySlider"

const handleSave = async () => {
    const snapshotBlob = await getModelViewerPlayer()?.gamelib.toBlob()
    if (!snapshotBlob) return

    const compressed  = await compress(blobToFile(snapshotBlob, "snapshot.png"), { maxWidthOrHeight: 500 })
    saveBlob(compressed, "snapshot.png")
}

const TitleBar: React.FC = () => {
    const [modelViewer, setModelViewer] = useModelViewer()
    const modelViewerTruthy = useTruthy(modelViewer)

    return (
        <AppBar position="relative" color="transparent" elevation={0} className="overflow-visible">
            <Toolbar variant="dense">
                <Button
                 className="mr-2"
                 variant="contained"
                 color="secondary"
                 size="small"
                 startIcon={<CancelIcon />}
                 onClick={() => setModelViewer(undefined)}
                >
                    关闭
                </Button>
                {modelViewerTruthy?.onSave && (
                    <Button
                     className="mr-2"
                     variant="contained"
                     color="secondary"
                     size="small"
                     startIcon={<SaveIcon />}
                     onClick={modelViewerTruthy.onSave}
                    >
                        保存
                    </Button>
                )}
                {Array.isArray(modelViewerTruthy?.src) && (
                    <ImageQualitySlider
                     files={modelViewerTruthy!.src}
                     onFinish={newFiles => assignModelViewer({ src: newFiles })}
                    />
                )}
            </Toolbar>
        </AppBar>
    )
}

export default TitleBar