import React, { useState, useEffect, useRef } from "react"
import { Cancellable, Resolvable } from "@lincode/promiselikes"
import { getPreviewCode, refreshPreviewCode } from "../../../state/usePreviewCode"
import { getDirTree } from "../../../state/useDirTree"
import { resetConsoleData, pushConsoleData } from "../../../state/useConsoleData"
import { getPreviewOrbit } from "../../../state/usePreviewOrbit"
import { getAbsoluteURI } from "../../../utils/uriGetters"
import { languageWorkerCompile } from "../CodeEditor/lingoscript/languageWorker"
import { getPreviewPicker } from "../../../state/usePreviewPicker"
import { setPreviewCameraCount } from "../../../state/usePreviewCameraCount"
import { getPreviewCamera, setPreviewCamera } from "../../../state/usePreviewCamera"
import { controls } from "../CodeEditor/Code"
import fileOpen from "../../../actions/file/fileOpen"
import { getPreviewSafeMode } from "../../../state/usePreviewSafeMode"
import loadPlayer from "../../../utils/loadPlayer"
import { onPreviewFullScreen } from "../../../events/onPreviewFullScreen"
import { getAssistantAnimate } from "../../../state/useAssistantAnimate"
import { createEffect } from "@lincode/reactivity"
import { debounce } from "@lincode/utils"
import { usePreviewPauseCount } from "../../../state/usePreviewPauseCount"
import { LoadingMask } from "@pinyinma/components"
import { getAdmin } from "../../../state/useAdmin"
import { setPreviewPlayer } from "../../../state/usePreviewPlayer"

interface PreviewPlayerProps {
    background?: string | number
}

const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ background }) => {
    const [loading, setLoading] = useState(true)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    
    const [pauseCount] = usePreviewPauseCount()
    const pause = pauseCount > 0

    useEffect(() => {
        if (pause) return

        const iframe = iframeRef.current!

        let cleanup = new Resolvable()

        const refreshHandle = createEffect(debounce(async () => {
            if (!getDirTree()) return

            const previewCode = getPreviewCode()

            setLoading(true)

            cleanup.resolve()
            cleanup = new Resolvable()

            if (previewCode && !getPreviewSafeMode()) {
                const { code, uri } = previewCode
                const [compiled] = await languageWorkerCompile(uri, code)
                getAdmin() && console.log(compiled)

                await new Promise<void>(resolve => cleanup.watch(getAssistantAnimate((animate, handle) => {
                    if (animate) return
                    handle.cancel()
                    resolve()
                })))

                resetConsoleData()
                pushConsoleData({ message: "编译成功" })
                pushConsoleData({ message: new Date().toLocaleString() })

                const player = await loadPlayer({
                    debugMode: true,
                    iframe,
                    cleanup,
                    code: compiled,
                    onPrint: message => pushConsoleData({ message })
                })
                setPreviewPlayer(player)
                cleanup.then(() => setPreviewPlayer(undefined))
                cleanup.watch(player.onReload(refreshPreviewCode))

                typeof background === "string" && player.gamelib.setBackgroundColor(background)
                
                cleanup.watch(getPreviewOrbit(player.gamelib.setOrbitControls))
                cleanup.watch(getPreviewPicker(player.gamelib.setSelection))

                cleanup.watch(player.gamelib.getSelectionTarget(target => {
                    const tokenAddress = player.getTokenAddress(target)
                    tokenAddress && controls.jumpTo(getAbsoluteURI(tokenAddress.uri), tokenAddress.line, fileOpen)
                }))

                cleanup.watch(player.gamelib.getCameraList(list => {
                    setPreviewCameraCount(list.length)
                }))
                cleanup.watch(player.gamelib.getCamera(cam => {
                    setPreviewCamera(player.gamelib.getCameraList().indexOf(cam))
                }))
                cleanup.watch(getPreviewCamera(index => {
                    player.gamelib.setCamera(player.gamelib.getCameraList()[index])
                }))

                const getLoadingCount = (iframe.contentWindow as any).$eWRhpRV$loadingCount[1]
                await new Promise<void>(resolve => {
                    cleanup.watch(getLoadingCount((loadingCount: number, handle: Cancellable) => {
                        if (loadingCount !== 0) return
                        handle.cancel()
                        resolve()
                    }))
                })
            }
            setLoading(false)

        }, 0, "trailing"), [getDirTree, getPreviewCode])

        return () => {
            cleanup.resolve()
            refreshHandle.cancel()
        }
    }, [pause])

    useEffect(() => {
        const handle = onPreviewFullScreen(() => {
            iframeRef.current?.requestFullscreen()
        })
        return () => {
            handle.cancel()
        }
    }, [])

    return (
        <>
            <iframe className="lingo-preview w-full h-full absolute" ref={iframeRef} />
            <LoadingMask clickThrough show={loading} />
        </>
    )
}

export default PreviewPlayer