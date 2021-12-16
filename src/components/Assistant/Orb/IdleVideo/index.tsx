import React, { useEffect, useRef } from "react"
import { animated, SpringValue } from "react-spring"
import { setAssistantOpen, useAssistantOpen } from "../../../../state/useAssistantOpen"
import { useAssistantShow } from "../../../../state/useAssistantShow"
//@ts-ignore
import hexagonsSrc from "./hexagons.mp4"

const IdleVideo: React.FC<{
    orbSize: number, opacity: SpringValue<number>, scale: SpringValue<number>

}> = ({ orbSize, opacity, scale }) => {

    const [open] = useAssistantOpen()
    const [show] = useAssistantShow()

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (open && show) videoRef.current!.pause()
        else videoRef.current!.play()
    }, [open, show])

    return (
        <animated.div className="center" onClick={() => setAssistantOpen(true)} style={{
            width: orbSize,
            height: orbSize,
            opacity,
            display: opacity.to(v => v > 0 ? "block" : "none")
        }}>
            <animated.video
             className="absolute"
             src={hexagonsSrc}
             ref={videoRef}
             loop
             muted
             width={orbSize} style={{ transform: scale.to(v => `scale(${v})`) }}
            />
        </animated.div>
    )
}

export default IdleVideo