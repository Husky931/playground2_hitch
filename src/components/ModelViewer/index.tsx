import React from "react"
import { useModelViewer } from "../../state/useModelViewer"
import UISuspense from "@pinyinma/ui-suspense"
import ModalDialog from "@pinyinma/modal-dialog"

const ModelViewer = React.lazy(() => import("./ModelViewer"))

const ModelViewerDialog = () => {
    const [modelViewer, setModelViewer] = useModelViewer()

    return (
        <ModalDialog open={!!modelViewer} onClose={() => setModelViewer(undefined)}>
            <div style={{ width: 600, height: 600 }}>
                <UISuspense>
                    <ModelViewer />
                </UISuspense>
            </div>
        </ModalDialog>
    )
}

export default ModelViewerDialog