import React from "react"
import LockIcon from "@mui/icons-material/Lock"
import { Spring, animated } from "react-spring"
import { useHomeReady } from "../../../state/useHomeReady"

const AnimLock: React.FC<{
    locked: boolean, onClick?: () => void, onContextMenu?: () => void, clickThrough?: boolean

}> = ({ locked, onClick, onContextMenu, clickThrough }) => {

    const [homeReady] = useHomeReady()
    const stayLocked = locked || !homeReady

    return (
        <Spring to={{ opacity: stayLocked ? 1 : 0, scale: stayLocked ? 1 : 3 }}>
            {p => (
                <animated.div
                 className="absfull cursor-pointer bg-black bg-opacity-25 flex justify-center items-center"
                 style={{ opacity: p.opacity, pointerEvents: (stayLocked && !clickThrough) ? "auto" : "none" }}
                 onClick={homeReady ? onClick : undefined}
                 onContextMenu={e => (e.preventDefault(), onContextMenu?.())}
                >
                    <animated.div style={{ scale: p.scale }}>
                        <LockIcon />
                    </animated.div>
                </animated.div>
            )}
        </Spring>
    )
}

export default AnimLock