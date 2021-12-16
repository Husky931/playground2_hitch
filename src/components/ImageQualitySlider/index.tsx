import { FormControlLabel, Slider, Switch } from "@mui/material"
import { getExtensionType } from "@pinyinma/validators"
import React, { useEffect, useMemo, useRef, useState } from "react"
import compress from "browser-image-compression"
import b2mb from "../../utils/b2mb"
import { LoadingButton } from "@mui/lab"

interface ImageQualitySliderProps {
    files: Array<[string, File]>
    onFinish: (files: Array<[string, File]>) => void
}

const compressFiles = async (files: Array<[string, File]>, val: number) => {
    const newFiles: Array<[string, File]> = []

    for (const [url, file] of files) {
        if (getExtensionType(url) === "image") {
            const newFile = await compress(file, { maxWidthOrHeight: val / 100 * 1000 })
            newFiles.push([url, newFile])
        }
        else newFiles.push([url, file])
    }
    return newFiles
}

const ImageQualitySlider: React.FC<ImageQualitySliderProps> = ({ files, onFinish }) => {
    const [compressing, setCompressing] = useState(false)
    const [enabled, setEnabled] = useState(false)

    const filesFirstPassRef = useRef<typeof files>()

    useEffect(() => {
        if (!enabled || filesFirstPassRef.current) return
        filesFirstPassRef.current = []

        ;(async () => {
            setCompressing(true)
            onFinish(filesFirstPassRef.current = await compressFiles(files, 100))
            setCompressing(false)
        })()
    }, [enabled])

    const handleCompress = async (_: any, val: number | Array<number>) => {
        if (typeof val !== "number" || !filesFirstPassRef.current) return
        setCompressing(true)
        onFinish(await compressFiles(filesFirstPassRef.current, val))
        setCompressing(false)
    }

    const fileSize = useMemo(() => {
        let fileSize = 0
        for (const [, file] of files)
            fileSize += file.size

        return b2mb(fileSize).toFixed(2) + "mb"

    }, [files])

    return (
        <>
            <div className="flex-grow px-4">
                {enabled && (
                    <Slider
                     defaultValue={100}
                     valueLabelDisplay="auto"
                     step={10}
                     marks
                     min={10}
                     max={100}
                     disabled={compressing || !enabled}
                     onChangeCommitted={handleCompress}
                    />
                )}
            </div>
            {enabled ? (
                <LoadingButton className="w-24 overflow-hidden" loading={compressing}>
                    {fileSize}
                </LoadingButton>
            ) : (
                <FormControlLabel
                 control={
                     <Switch checked={enabled} onChange={() => setEnabled(!enabled)} />
                 }
                 label="压缩材质"
                 disabled={enabled}
                />
            )}
        </>
    )
}

export default ImageQualitySlider