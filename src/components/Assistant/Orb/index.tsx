import React, { useMemo, useEffect } from "react"
import { Spring, animated } from "react-spring"
import { useResizeObserver, useWindowSize } from "@lincode/hooks"
import IdleVideo from "./IdleVideo"
import Dialog from "./Dialog"
import { useAssistantOpen } from "../../../state/useAssistantOpen"
import { useAssistantHighlightBounds } from "../../../state/useAssistantHighlightBounds"
import { rangeOverlap } from "@lincode/math"
import { setAssistantHighlightBezierStart } from "../../../state/useAssistantHighlightBezierStart"
import { useAssistantDialog } from "../../../state/useAssistantDialog"
import { useAssistantAudioState } from "../../../state/useAssistantAudioState"
import { useAssistantColor } from "../../../state/useAssistantColor"
import { useAssistantShow } from "../../../state/useAssistantShow"
import { setAssistantAnimate } from "../../../state/useAssistantAnimate"

const handleAnimateStart = () => setAssistantAnimate(true)

const handleAnimateEnd = () => setAssistantAnimate(false)

const colors = {
    primary: "linear-gradient(to left bottom, #005c97, #363795)",
    secondary: "linear-gradient(to right, #e44d26, #f16529)",
    code: "linear-gradient(to left bottom, rgb(20, 20, 20), rgb(40, 40, 40))"
}

const orbSize = 50
const orbRadius = orbSize * 0.5
const orbMarginY = 60
const orbMarginX = 30

const Orb: React.FC = () => {
    const [observeResize, [, dialogHeight]] = useResizeObserver()
    const [open] = useAssistantOpen()
    const [show] = useAssistantShow()
    const [bounds] = useAssistantHighlightBounds()
    const [windowWidth] = useWindowSize()
    const [dialog] = useAssistantDialog()
    const [audioState] = useAssistantAudioState()
    const [assistantColor] = useAssistantColor()

    const color = audioState === "stopped" && open ? assistantColor : "primary"

    const dialogWidth = useMemo(() => {
        return audioState === "stopped" && dialog.message.includes("```") ? 350 : 250
    }, [dialog, audioState])

    const w = open ? dialogWidth : orbSize
    const h = open ? dialogHeight : orbSize
    const rightTX = windowWidth - w - orbMarginX

    const [moveToLeft, leftTX] = useMemo(() => {
        if (!open || !bounds)
            return [false, orbMarginX]

        const left = rightTX
        const right = left + w
        if (!rangeOverlap(left, right, bounds.left, bounds.right))
            return [false, orbMarginX]

        const centerX = (bounds.left + bounds.right) * 0.5
        return [centerX > windowWidth * 0.5, bounds.left - dialogWidth - 100]

    }, [bounds, open, windowWidth, dialogWidth])
    
    const tx = moveToLeft ? leftTX : rightTX

    useEffect(() => {
        if (!open)
            setAssistantHighlightBezierStart(undefined)
        else
            setAssistantHighlightBezierStart([moveToLeft ? tx + orbRadius : tx + w - orbRadius, orbMarginY + orbRadius])

    }, [tx, w, open])

    return (
        <Spring
         to={{
             w, h, tx,
             radius: open ? 5 : orbSize,
             videoOpacity: open ? 0 : 1,
             videoScale: open ? Math.max(dialogWidth, dialogHeight * 2) / orbSize : 1,
             dialogOpacity: open ? 1 : 0,
             opacity: show ? 1 : 0
         }}
         onStart={handleAnimateStart}
         onRest={handleAnimateEnd}
        >
            {p => (
                <animated.div
                 className="absfull text-white z-50 overflow-hidden"
                 style={{
                     width: p.w,
                     height: p.h,
                     borderRadius: p.radius,
                     background: colors[color],
                     translateX: p.tx,
                     translateY: orbMarginY,
                     opacity: p.opacity,
                     pointerEvents: show ? "auto" : "none"
                 }}
                >
                    <IdleVideo orbSize={orbSize} opacity={p.videoOpacity} scale={p.videoScale} />
                    <Dialog width={dialogWidth} opacity={p.dialogOpacity} observeResize={observeResize} />
                </animated.div>
            )}
        </Spring>
    )
}

export default Orb