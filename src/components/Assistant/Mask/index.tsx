import React from "react"
import { useTruthy } from "@lincode/hooks"
import { useTheme } from "@pinyinma/playground-theme"
import { animated, Spring } from "react-spring"
import { useAssistantHighlightBounds } from "../../../state/useAssistantHighlightBounds"
import { useAssistantOpen } from "../../../state/useAssistantOpen"
import { useAssistantHighlight } from "../../../state/useAssistantHighlight"
import { useAssistantHighlightTarget } from "../../../state/useAssistantHighlightTarget"

const nullBounds = { width: 0, height: 0, left: 0, top: 0, right: 0, bottom: 0 }

const Mask: React.FC = () => {
    const [theme] = useTheme()
    const [open] = useAssistantOpen()
    const [target] = useAssistantHighlightTarget()
    const [highlight] = useAssistantHighlight()
    const [bounds] = useAssistantHighlightBounds()

    const boundsTruthy = useTruthy(bounds)
    const { width, height, left, top, right, bottom } = boundsTruthy ?? nullBounds

    return (
        <Spring to={{ opacity: open && target ? 1 : 0 }}>
            {p => (
                <animated.div className="absfull z-50" style={{
                    pointerEvents: highlight?.clickable ? "none" : "auto",
                    opacity: p.opacity,
                    display: p.opacity.to(v => v > 0 ? "block" : "none")
                }}>
                    <div className="w-full absolute bg-black opacity-50 pointer-events-auto" style={{
                        height: top
                    }} />
                    <div className="w-full absolute bg-black opacity-50 pointer-events-auto" style={{
                        height: window.innerHeight - bottom,
                        top: bottom
                    }} />
                    <div className="absolute bg-black opacity-50 pointer-events-auto" style={{
                        width: left,
                        height: height,
                        top: top
                    }} />
                    <div className="absolute bg-black opacity-50 pointer-events-auto" style={{
                        width: window.innerWidth - right,
                        height: height,
                        left: right,
                        top: top
                    }} />
                    <div className="absolute" style={{
                        display: width + height > 0 ? "block" : "none",
                        border: `2px solid ${theme.palette.primary.main}`,
                        borderRadius: 10,
                        left: left - 10,
                        top: top - 10,
                        width: width + 20,
                        height: height + 20
                    }} />
                </animated.div>
            )}
        </Spring>
    )
}

export default Mask