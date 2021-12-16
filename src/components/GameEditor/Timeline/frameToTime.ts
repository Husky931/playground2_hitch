export const frameToTime = (frame: number) => Number((frame / 60).toPrecision(2))

export const timeToFrame = (time: number) => Math.round(time * 60)