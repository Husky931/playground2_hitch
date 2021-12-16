import { forceGet } from "@lincode/utils"
import type { AnimationData, AnimationNode } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"
import { Keyframes } from "@pinyinma/timeline/lib/state/makeUseKeyframes"
import { nanoid } from "nanoid"
import keyframeTrackToAnimationData from "./keyframeTrackToAnimationData"

const keyframesUUIDMap = new WeakMap<Keyframes, string>()

export default (keyframes: Keyframes) => {
    const uuid = forceGet(keyframesUUIDMap, keyframes, nanoid)
    const data: Record<string, AnimationData> = {}
    const animationNode: AnimationNode = { type: "animation", name: "animation", uuid, data }

    for (const [id, track] of Object.entries(keyframes))
        data[id] = keyframeTrackToAnimationData(track)

    return animationNode
}