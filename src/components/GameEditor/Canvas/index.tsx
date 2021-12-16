import React, { useEffect, useRef, useState } from "react"
import { Resolvable } from "@lincode/promiselikes"
import { getGameEditorTool } from "../../../state/useGameEditorTool"
import loadPlayer from "../../../utils/loadPlayer"
import Game from "./Game"
import { resetGameEditorSelectionTarget, setGameEditorSelectionTarget } from "../../../state/useGameEditorSelectionTarget"
import { emitGameEditorTransformControls } from "../../../events/onGameEditorTransformControls"
import { CreateObject, CreateObjectContext, nodeInstanceMap, instanceNodeMap } from "./GameComponent"
import useSelectionTargetHotKeys from "./hooks/useSelectionTargetHotKeys"
import ObjectBar from "./ObjectBar"
import useHotKeys from "./hooks/useHotKeys"
import useSave from "./hooks/useSave"
import { useFileLoading } from "../../../state/useFileLoading"
import { useGameEditorTab } from "../../../state/useGameEditorTab"
import useDrop from "./hooks/useDrop"
import { BaseNode, resetGameEditorGraph } from "../../../state/useGameEditorGraph"
import { Border, LoadingMask } from "@pinyinma/components"
import { onGameEditorSelectionTarget } from "../../../events/onGameEditorSelectionTarget"
import { emitGameEditorOrbitControls, onGameEditorOrbitControls } from "../../../events/onGameEditorOrbitControls"
import { setContextMenu } from "@pinyinma/context-menu"
import { onGameEditorMultipleSelection } from "../../../events/onGameEditorMultipleSelection"
import isMultipleSelectionGroup from "../utils/isMultipleSelectionGroup"
import { onGameEditorMultipleSelectionEnabled } from "../../../events/onGameEditorMultipleSelectionEnabled"
import useTransformControls from "./hooks/useTransformControls"
import { onGameEditorSelection } from "../../../events/onGameEditorSelection"
import useMultipleSelection from "./hooks/useMultipleSelection"
import { isNotNullish } from "@lincode/utils"

let contextMenu = false
let timeout: NodeJS.Timeout
const handleContextMenu = () => {
    contextMenu = true
    timeout = setTimeout(() => {
        contextMenu = false
    }, 300)
}
const handleMouseUp = () => {
    contextMenu && setContextMenu([{ text: "group", onClick: () => console.log("group") }])
}
onGameEditorOrbitControls(val => {
    if (val !== "move") return
    contextMenu = false
    clearTimeout(timeout)
})

const Canvas: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    useTransformControls()
    useMultipleSelection()
    useSelectionTargetHotKeys()
    useHotKeys()
    useSave()
    const [setDropEl, dragOver] = useDrop()

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [playerLoading, setPlayerLoading] = useState(true)
    const [createObject, setCreateObject] = useState<[CreateObject]>()
    const [tab] = useGameEditorTab()
    const [loading] = useFileLoading()

    useEffect(() => {
        const iframe = iframeRef.current!

        const cleanup = new Resolvable()

        ;(async () => {
            await new Promise(resolve => setTimeout(resolve, 300))
            
            const player = await loadPlayer({ debugMode: false, iframe, cleanup, legacy: "latest" })
            
            typeof style?.background === "string" && player.gamelib.setBackgroundColor(style.background)

            player.gamelib.setGridHelper(true)
            player.gamelib.setSelection(true)
            player.gamelib.setOrbitControls(true)

            const handleKeyDown = (e: KeyboardEvent) => e.shiftKey && player.gamelib.setMultipleSelection(true)
            const handleKeyUp = () => player.gamelib.setMultipleSelection(false)
            document.addEventListener("keydown", handleKeyDown)
            document.addEventListener("keyup", handleKeyUp)
            cleanup.then(() => {
                document.removeEventListener("keydown", handleKeyDown)
                document.removeEventListener("keyup", handleKeyUp)
            })

            cleanup.watch(player.gamelib.getSelectionTarget(target => {
                if (!target)
                    resetGameEditorSelectionTarget()
                else if (isMultipleSelectionGroup(target))
                    setGameEditorSelectionTarget({
                        instance: target,
                        nodes: player.gamelib.getMultipleSelectionTargets()
                            .map(t => instanceNodeMap.get(t))
                            .filter<BaseNode>(isNotNullish)
                    })
                else setGameEditorSelectionTarget({
                    instance: target,
                    nodes: [target && instanceNodeMap.get(target)].filter<BaseNode>(isNotNullish)
                })
            }))
            cleanup.watch(getGameEditorTool(player.gamelib.setTransformControls))
            cleanup.watch(player.gamelib.onTransformControls(emitGameEditorTransformControls))
            cleanup.watch(player.gamelib.onOrbitControls(emitGameEditorOrbitControls))
            cleanup.watch(onGameEditorSelectionTarget(node => {
                player.gamelib.emitSelectionTarget(node && nodeInstanceMap.get(node))
            }))
            cleanup.watch(onGameEditorSelection(player.gamelib.setSelection))
            cleanup.watch(onGameEditorMultipleSelection(player.gamelib.setMultipleSelection))
            cleanup.watch(onGameEditorMultipleSelectionEnabled(player.gamelib.setMultipleSelectionEnabled))
            
            setCreateObject([player.gamelib.createObject])
            setPlayerLoading(false)
        })()

        return () => {
            cleanup.resolve()
            resetGameEditorSelectionTarget()
            resetGameEditorGraph()
        }
    }, [])

    return (
        <div style={style} ref={setDropEl}>
            <iframe
             className="w-full h-full absolute"
             ref={iframeRef}
             onContextMenu={handleContextMenu}
             onMouseUp={handleMouseUp}
            />
            {createObject && (
                <CreateObjectContext.Provider value={createObject[0]}>
                    <Game />
                </CreateObjectContext.Provider>
            )}
            <ObjectBar />
            {dragOver && (
                <div className="absfull bg-black bg-opacity-50 text-white flex items-center justify-center z-10">
                    添加至当前场景
                </div>
            )}
            <LoadingMask show={playerLoading || !!(tab && loading[tab])} />
            <Border />
            <Border horizontal />
        </div>
    )
}

export default Canvas