import React from "react"
import PreviewToolbar from "./PreviewToolbar"
import Console from "./Console"
import PreviewPlayer from "./PreviewPlayer"

const Preview: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    return (
        <div style={style} className="flex flex-col">
            <PreviewToolbar />
            <div className="flex-grow">
                <PreviewPlayer background={style.background} />
            </div>
            <Console />
        </div>
    )
}

export default Preview