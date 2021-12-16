import React, { useEffect, useRef, useState } from "react"
import { Resolvable } from "@lincode/promiselikes"
import loadPlayer from "../../utils/loadPlayer"
import dedent from "ts-dedent"
import { useTruthy } from "@lincode/hooks"
import { useModelViewer } from "../../state/useModelViewer"
import { setModelViewerPlayer } from "../../state/useModelViewerPlayer"

const Canvas: React.FC<{ className: string }> = ({ className }) => {
    const [modelViewer] = useModelViewer()
    const modelViewerTruthy = useTruthy(modelViewer)
    const [urlMap, setURLMap] = useState<Record<string, string>>()
    const [src, setSrc] = useState("")

    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const files = modelViewerTruthy?.src
        if (!Array.isArray(files)) {
            if (files instanceof File) {
                const objectURL = URL.createObjectURL(files)
                setSrc(objectURL)

                return () => {
                    URL.revokeObjectURL(objectURL)
                }
            }
            setSrc(files ?? "")
            return
        }

        const urlMap: Record<string, string> = {}
        let gltfSrc = ""

        for (const [url, file] of files) {
            urlMap[url] = URL.createObjectURL(file)
            !gltfSrc && url.endsWith(".gltf") && (gltfSrc = urlMap[url])
        }
        
        setURLMap(urlMap)
        setSrc(gltfSrc)

        return () => {
            for (const objectURL of Object.values(urlMap))
                URL.revokeObjectURL(objectURL)

            setURLMap(undefined)
            setSrc("")
        }
    }, [modelViewerTruthy?.src])

    useEffect(() => {
        const iframe = iframeRef.current!

        const cleanup = new Resolvable()

        ;(async () => {
            const code = dedent`
                rendering.defaultLight = false

                const sky = new SkyLight()
                sky.intensity = 0.5

                const l0 = new DirectionalLight()
                l0.innerZ = -100
                l0.intensity = 0.25

                const l1 = new DirectionalLight()
                l1.innerZ = -0
                l1.intensity = 0.25

                const l2 = new DirectionalLight()
                l2.innerZ = 100
                l2.intensity = 0.25

                const l3 = new DirectionalLight()
                l3.innerZ = -100
                l3.innerX = -100
                l3.intensity = 0.25

                const l4 = new DirectionalLight()
                l4.innerZ = -0
                l4.innerX = -100
                l4.intensity = 0.25

                const l5 = new DirectionalLight()
                l5.innerZ = 100
                l5.innerX = -100
                l5.intensity = 0.25

                const l6 = new DirectionalLight()
                l6.innerZ = -100
                l6.innerX = 100
                l6.intensity = 0.25

                const l7 = new DirectionalLight()
                l7.innerZ = -0
                l7.innerX = 100
                l7.intensity = 0.25

                const l8 = new DirectionalLight()
                l8.innerZ = 100
                l8.innerX = 100
                l8.intensity = 0.25

                let model = new Model()
                model.src = "${src}"
                model.scale = 2
            `
            const player = await loadPlayer({ debugMode: false, iframe, cleanup, code, urlMap, legacy: "latest" })
            setModelViewerPlayer(player)

            player.gamelib.setSelection(true)
            player.gamelib.setOrbitControls(true)
        })()

        return () => {
            cleanup.resolve()
            setModelViewerPlayer(undefined)
        }
    }, [urlMap, src])

    return (
        <div className={className}>
            <iframe className="w-full h-full absolute" ref={iframeRef} />
        </div>
    )
}

export default Canvas