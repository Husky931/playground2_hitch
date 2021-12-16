import type { AnimationData } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"
import { KeyframeTrack } from "@pinyinma/timeline/lib/state/makeUseKeyframes"
import { frameToTime } from "./frameToTime"

const prune = (keyframeTrack: AnimationData) => {
    for (const [property, frames] of Object.entries(keyframeTrack)) {
        const values = Object.values(frames)
        const initial = values[0]
        if (!values.some(v => v !== initial))
            delete keyframeTrack[property]
    }
}

export default (track: KeyframeTrack) => {
    const animationData: AnimationData = {}
    for (const { data, frame } of Object.values(track)) {
        if (!data) continue
        for (const [property, value] of Object.entries(data))
            (animationData[property] ??= {})[frameToTime(frame)] = value
    }
    prune(animationData)
    return animationData
}