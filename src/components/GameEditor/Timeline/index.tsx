import { usePrevious } from "@lincode/hooks"
import { defaultKeyframeData, KeyframeData, Keyframes, KeyframeTrack, KeyframeType, sortKeyframeEntries } from "@pinyinma/timeline/lib/state/makeUseKeyframes"
import { isChildLayer, Layer } from "@pinyinma/timeline/lib/state/makeUseLayers"
import React, { useEffect } from "react"
import { emitGameEditorSelectionTarget } from "../../../events/onGameEditorSelectionTarget"
import { BaseNode, useGameEditorGraph } from "../../../state/useGameEditorGraph"
import { useGameEditorSelectionTarget } from "../../../state/useGameEditorSelectionTarget"
import { uuidNodeInstanceMap } from "../Canvas/GameComponent"
import { timeToFrame, frameToTime } from "./frameToTime"
import TimelineComponent, { timelineState } from "./TimelineComponent"
import keyframeTrackToAnimationData from "./keyframeTrackToAnimationData"
import keyframesToAnimationNode from "./keyframesToAnimationNode"
import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import isMultipleSelectionGroup from "../utils/isMultipleSelectionGroup"

const getKeyframeData = (node: BaseNode) => ({
    ...defaultKeyframeData,
    ...Object.fromEntries(Object.entries(node).filter((o): o is [string, number] => o[0] in defaultKeyframeData))
})

const setKeyframeData = (
    keyframe: KeyframeType, node: BaseNode, instance: SimpleObjectManager, keyframes: Keyframes, keyframeData?: KeyframeData
) => {
    keyframe.data = keyframeData ?? getKeyframeData(node)

    const track = keyframes[node.uuid]
    if (!track) return

    const animationData = keyframeTrackToAnimationData(track)
    if (!Object.keys(animationData).length) return

    const animation = instance.animations.get("animation") ?? instance.createAnimation("animation")
    animation.setTracks(animationData)
}

interface TimelineProps {
    style?: React.CSSProperties
}

const Timeline: React.FC<TimelineProps> = ({ style }) => {
    const [{ animationNodes }] = useGameEditorGraph()

    const [{ instance: selectionInstance, nodes }] = useGameEditorSelectionTarget()
    const [selectionNode] = nodes
    const selectionNodePrev = usePrevious(selectionNode)

    const [layerSelected, setLayerSelected] = timelineState.useLayerSelected()
    const parentLayerSelected = layerSelected && isChildLayer(layerSelected) ? layerSelected.parent : layerSelected

    const [layersWrapper] = timelineState.useLayers()
    const [layers] = layersWrapper

    const [keyframesWrapper] = timelineState.useKeyframes()
    const [keyframes] = keyframesWrapper

    useEffect(() => {
        const handle0 = timelineState.onAddKeyframe(([id, keyframe]) => {
            const found = uuidNodeInstanceMap.get(id)
            found && setKeyframeData(keyframe, found.node, found.instance, timelineState.getKeyframes()[0])
        })
        const handle1 = timelineState.getFrame(frame => {
            for (const id of Object.keys(timelineState.getKeyframes()[0])) {
                const found = uuidNodeInstanceMap.get(id)
                const animation = found?.instance.animations.get("animation")
                animation?.update(Math.min(frameToTime(frame), animation.duration - Number.EPSILON))
            }
        })
        const handle2 = timelineState.getPlaying(playing => {
            playing && emitGameEditorSelectionTarget(undefined)
        })

        return () => {
            handle0.cancel()
            handle1.cancel()
            handle2.cancel()
        }
    }, [])

    useEffect(() => {
        const layer = selectionNode && layers.find(l => l.id === selectionNode.uuid)
        parentLayerSelected !== layer && setLayerSelected(layer)
    }, [selectionNode, layersWrapper])

    useEffect(() => {
        const found = parentLayerSelected && uuidNodeInstanceMap.get(parentLayerSelected.id)
        found && emitGameEditorSelectionTarget(found.node)
    }, [parentLayerSelected])

    useEffect(() => {
        if (!selectionNode || !selectionInstance || !selectionNodePrev) return

        const [keyframes] = timelineState.getKeyframes()
        const kf = keyframes[selectionNode.uuid]
        if (!kf) return

        const sorted = sortKeyframeEntries(kf)
        const frame = timelineState.getFrame()

        let keyframeSelected: KeyframeType | undefined
        for (const [, keyframe] of sorted) {
            if (keyframe.frame > frame) break
            keyframeSelected = keyframe
        }
        if (keyframeSelected && !isMultipleSelectionGroup(selectionInstance))
            setKeyframeData(keyframeSelected, selectionNode, selectionInstance, keyframes)

    }, [selectionNode?.update])

    useEffect(() => {
        if (!selectionNode || !selectionNodePrev) return

        const animationNode = keyframesToAnimationNode(keyframes)

        const targetAnimationNode = animationNodes.find(a => a.uuid === animationNode.uuid)
        if (targetAnimationNode)
            targetAnimationNode.data = animationNode.data
        else
            animationNodes.push(animationNode)

    }, [selectionNode?.update, keyframesWrapper])

    useEffect(() => {
        timelineState.setFrame(0)
        timelineState.setFrameSelected(undefined)

        const timeout = setTimeout(() => {
            const layers: Array<Layer> = []
            const keyframes: Keyframes = {}

            for (const animationNode of animationNodes) {
                for (const [uuid, animationData] of Object.entries(animationNode.data)) {
                    const found = uuidNodeInstanceMap.get(uuid)
                    if (!found) continue
    
                    const { node, instance } = found

                    layers.push({ id: uuid, label: node.name ?? node.type, children: [] })
                    const keyframeTrack: KeyframeTrack = keyframes[uuid] = {}
    
                    for (const [propertyName, record] of Object.entries(animationData))
                        for (const [time, value] of Object.entries(record)) {
                            const frame = timeToFrame(Number(time))

                            if (!keyframeTrack[frame])
                                queueMicrotask(() => setKeyframeData(keyframe, node, instance, keyframes, data))

                            const keyframe = keyframeTrack[frame] ??= { frame }
                            const data: Record<string, number> = keyframe.data ??= {}
                            data[propertyName] = value
                        }
                }
            }
            timelineState.setLayers([layers])
            timelineState.setKeyframes([keyframes])
        })
        return () => {
            clearTimeout(timeout)
        }
    }, [animationNodes])
    
    return (
        <TimelineComponent style={style} />
    )
}

export default Timeline