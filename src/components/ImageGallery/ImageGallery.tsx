import React from "react"
import Images from "./Images"
import TitleBar from "./TitleBar"

const ImageGallery: React.FC = () => {
    return (
        <div className="absfull flex flex-col">
            <TitleBar />
            <Images className="flex-grow" />
        </div>
    )
}

export default ImageGallery