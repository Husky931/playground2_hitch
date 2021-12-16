import React, { useEffect, useState } from "react"
import { useImageGallery } from "../../state/useImageGallery"

const Images: React.FC<{ className: string }> = React.memo(({ className }) => {
    const [imageGallery] = useImageGallery()
    const [srcs, setSrcs] = useState<Array<string>>()

    useEffect(() => {
        if (!imageGallery?.src) return
        
        const srcs = imageGallery.src.map(([, file]) => URL.createObjectURL(file))
        setSrcs(srcs)

        return () => {
            for (const src of srcs)
                URL.revokeObjectURL(src)
        }
    }, [imageGallery])

    return (
        <div className={"grid grid-cols-3 overflow-y-scroll " + (className ?? "")}>
            {srcs?.map((src, i) => (
                <div key={i} className="w-full bg-cover bg-center" style={{ backgroundImage: `url(${src})`, minHeight: 150 }} />
            ))}
        </div>
    )
})

export default Images