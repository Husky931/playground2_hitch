import React from "react"
import { useImageGallery } from "../../state/useImageGallery"
import UISuspense from "@pinyinma/ui-suspense"
import ModalDialog from "@pinyinma/modal-dialog"

const ImageGallery = React.lazy(() => import("./ImageGallery"))

const ImageGalleryDialog = () => {
    const [imageGallery, setImageGallery] = useImageGallery()

    return (
        <ModalDialog open={!!imageGallery} onClose={() => setImageGallery(undefined)}>
            <div style={{ width: 600, height: 600 }}>
                <UISuspense>
                    <ImageGallery />
                </UISuspense>
            </div>
        </ModalDialog>
    )
}

export default ImageGalleryDialog