import React from "react"
import TitleBar from "./TitleBar"
import Canvas from "./Canvas"

const ModelViewer: React.FC = () => {
    return (
        <div className="absfull flex flex-col">
            <TitleBar />
            <Canvas className="flex-grow" />
        </div>
    )
}

export default ModelViewer