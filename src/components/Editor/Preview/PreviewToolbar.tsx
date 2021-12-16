import React from "react"
import { AppBar, Toolbar, FormControlLabel, Switch, Select, MenuItem } from "@mui/material"
import { usePreviewOrbit } from "../../../state/usePreviewOrbit"
import { usePreviewPicker } from "../../../state/usePreviewPicker"
import { usePreviewCameraCount } from "../../../state/usePreviewCameraCount"
import { usePreviewCamera } from "../../../state/usePreviewCamera"
import { range } from "@lincode/utils"

const PreviewToolbar: React.FC = () => {
    const [previewOrbit, setPreviewOrbit] = usePreviewOrbit()
    const [previewPicker, setPreviewPicker] = usePreviewPicker()
    const [previewCameraCount] = usePreviewCameraCount()
    const [previewCamera, setPreviewCamera] = usePreviewCamera()

    return (
        <AppBar position="relative" color="transparent" elevation={0}>
            <Toolbar variant="dense">
                <FormControlLabel
                 className="lingo-preview-orbit"
                 control={
                     <Switch checked={previewOrbit} onChange={() => setPreviewOrbit(!previewOrbit)} />
                 }
                 label="自由视角"
                 disabled={previewCamera > 0}
                />
                
                {/* <FormControlLabel
                 className="lingo-preview-picker"
                 control={
                     <Switch checked={previewPicker} onChange={() => setPreviewPicker(!previewPicker)} />
                 }
                 label="检查模式"
                /> */}

                <div className="flex-grow" />

                {previewCamera !== -1 && (
                    <Select value={previewCamera} variant="standard" onChange={e => setPreviewCamera(Number(e.target.value))}>
                        {range(0, previewCameraCount).map(i => (
                            <MenuItem key={i} value={i}>
                                相机 {i}
                            </MenuItem>
                        ))}
                    </Select>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default PreviewToolbar