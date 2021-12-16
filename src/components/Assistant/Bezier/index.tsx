import { usePrevious, useTruthy, useWindowSize } from "@lincode/hooks"
import { distance } from "@lincode/math"
import { useTheme } from "@pinyinma/playground-theme"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { animated, Spring } from "react-spring"
import { useAssistantHighlightBezierStart } from "../../../state/useAssistantHighlightBezierStart"
import { useAssistantHighlightBounds } from "../../../state/useAssistantHighlightBounds"
import { useAssistantHighlightTarget } from "../../../state/useAssistantHighlightTarget"
import { useAssistantOpen } from "../../../state/useAssistantOpen"

const Bezier: React.FC = () => {
    const [theme] = useTheme()
    const [bounds] = useAssistantHighlightBounds()
    const [target] = useAssistantHighlightTarget()
    const [open] = useAssistantOpen()
    const [windowWidth, windowHeight] = useWindowSize()
    const [resizing, setResizing] = useState(false)

    useEffect(() => {
        setResizing(true)
        const timeout = setTimeout(() => setResizing(false), 100)

        return () => {
            clearTimeout(timeout)
        }
    }, [windowWidth, windowHeight])

    const [startPoint] = useAssistantHighlightBezierStart()
    const startPointTruthy = useTruthy(startPoint)

    const moveToLeft = useTruthy(bounds && startPoint && (bounds?.right > startPoint[0]), open)
    const moveToLeftPrev = usePrevious(moveToLeft)
    const endPoint = bounds && [moveToLeft ? bounds.left - 10 : bounds.right + 10, (bounds.top + bounds.bottom) * 0.5]
    const endPointTruthy = useTruthy(endPoint)
    const [moveToLeftDelay, setMoveToLeftDelay] = useState(false)

    useLayoutEffect(() => {
        setMoveToLeftDelay(true)
        const timeout = setTimeout(() => setMoveToLeftDelay(false), 250)

        return () => {
            clearTimeout(timeout)
        }
    }, [moveToLeft])

    if (!startPointTruthy || !endPointTruthy) return null
    if (!open && moveToLeft) return null
    if (resizing) return null
    if (moveToLeftDelay) return null
    if (moveToLeftPrev !== moveToLeft) return null

    const [x0, y0] = startPointTruthy
    const [x1, y1] = endPointTruthy

    const controlPoint0 = [x0 + (x1 - x0) * 0.5, y0]
    const controlPoint1 = [x0 + (x1 - x0) * 0.5, y1]

    const offset = distance(x0, y0, x1, y1) + 30
    const show = startPoint && target && open && !resizing

    return (
        <Spring
         from={{ offset, opacity: 0 }}
         to={{ offset: show ? 0 : offset, opacity: show ? 1 : 0 }}
        >
            {p => (
                <animated.svg
                 viewBox={`0 0 ${windowWidth} ${windowHeight}`}
                 className="z-50 absfull pointer-events-none"
                 style={{ opacity: p.opacity, display: p.opacity.to(v => v > 0 ? "block" : "none") }}
                >
                    <animated.path
                     d={`M ${startPointTruthy} C ${controlPoint0} ${controlPoint1} ${endPointTruthy}`}
                     strokeDashoffset={p.offset}
                     strokeDasharray={offset}
                     stroke={theme.palette.primary.main}
                     strokeWidth="2"
                     fill="none"
                    />
                </animated.svg>
            )}
        </Spring>
    )
}

export default Bezier