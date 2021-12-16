import { AppBar, Toolbar, Button } from "@mui/material"
import React from "react"
import CancelIcon from "@mui/icons-material/Cancel"
import SaveIcon from "@mui/icons-material/Save"
import { useTruthy } from "@lincode/hooks"
import ImageQualitySlider from "../ImageQualitySlider"
import { assignImageGallery, useImageGallery } from "../../state/useImageGallery"

const TitleBar: React.FC = () => {
    const [imageGallery, setImageGallery] = useImageGallery()
    const imageGalleryTruthy = useTruthy(imageGallery)

    return (
        <AppBar position="relative" color="transparent" elevation={0} className="overflow-visible">
            <Toolbar variant="dense">
                <Button
                 className="mr-2"
                 variant="contained"
                 color="secondary"
                 size="small"
                 startIcon={<CancelIcon />}
                 onClick={() => setImageGallery(undefined)}
                >
                    关闭
                </Button>
                {imageGalleryTruthy?.onSave && (
                    <Button
                     className="mr-2"
                     variant="contained"
                     color="secondary"
                     size="small"
                     startIcon={<SaveIcon />}
                     onClick={imageGalleryTruthy.onSave}
                    >
                        保存
                    </Button>
                )}
                {imageGalleryTruthy?.src && (
                    <ImageQualitySlider
                     files={imageGalleryTruthy.src}
                     onFinish={newFiles => assignImageGallery({ src: newFiles })}
                    />
                )}
            </Toolbar>
        </AppBar>
    )
}

export default TitleBar