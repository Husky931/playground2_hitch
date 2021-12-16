import React from "react"
import "./utils/setup"
import { ThemeProvider } from "@mui/material"
import Home from "./components/Home"
import Dialog from "@pinyinma/dialog"
import { useProject } from "./state/useProject"
import { useTheme } from "@pinyinma/playground-theme"
import UISuspense from "@pinyinma/ui-suspense"
import ContextMenu from "@pinyinma/context-menu"
import Notifications from "./components/Notifications"
import Loading from "./components/Loading"
import ModelViewer from "./components/ModelViewer"
import AssistantWrapper from "./components/Assistant"
import { RASPBERRY } from "./globals"
import ImageViewer from "@pinyinma/image-viewer"
import ImageGallery from "./components/ImageGallery"

const Editor = React.lazy(() => import("./components/Editor"))
const PreviewPlayer = React.lazy(() => import("./components/Editor/Preview/PreviewPlayer"))

const App: React.FC = () => {
    const [theme] = useTheme()
    const [project] = useProject()
    
    return (
        <ThemeProvider theme={theme}>
            {project ? (
                <UISuspense>
                    {RASPBERRY ? <PreviewPlayer /> : <Editor />}
                </UISuspense>
            ) : (
                <Home />
            )}
            <ModelViewer />
            <ImageGallery />
            <ImageViewer />
            <ContextMenu />
            <Dialog />
            <Notifications />
            <Loading />
            <AssistantWrapper />
        </ThemeProvider>
    )
}
export default App