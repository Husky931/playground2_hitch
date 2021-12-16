import { Radio } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { useState } from "react"
import { Spring, animated } from "react-spring"
import { useAspectRatio } from "@lincode/hooks"

const ManagerCard: React.FC<{
    className: string
    edit: boolean
    onChecked: () => void
    onUnchecked: () => void
    onOpen: () => void
    onContextMenu: () => void
    title: string
    date: string

}> = ({ className, edit, onChecked, onUnchecked, onOpen, onContextMenu, title, date, children }) => {

    const[checked, setChecked] = useState(false)
    const setAspectRatioEl = useAspectRatio(0.7)

    useEffect(() => {
        !edit && setChecked(false)
    }, [edit])

    useEffect(() => {
        checked ? onChecked() : onUnchecked()
    }, [checked])

    const dateFormatted = useMemo(() => new Date(date).toLocaleDateString("en-US"), [date])

    return (
        <Spring to={{ cardScale: checked ? 1.02 : 1, maskOpacity: edit && !checked ? 1 : 0 }}>
            {p => (
                <animated.div
                 className={`rounded-lg overflow-hidden p-6 w-full${checked ? " shadow-xl " : " "}${className}`}
                 ref={setAspectRatioEl}
                 style={{ transform: p.cardScale.to(s => `scale(${s})`) }}
                >
                    <div className="text-xl opacity-75">
                        {dateFormatted}
                    </div>
                    <div className="text-2xl font-bold">
                        {title}
                    </div>
                    <div
                     className="absfull cursor-pointer"
                     onClick={() => edit ? setChecked(!checked) : onOpen()}
                     onContextMenu={e => (e.preventDefault(), !edit && onContextMenu())}
                    >
                        <animated.div
                         className="bg-black bg-opacity-50 absfull"
                         style={{ opacity: p.maskOpacity }}
                        />
                        {!edit ? undefined : (
                            <Radio
                             className="absolute"
                             style={{ right: 0, top: 0 }}
                             color="default"
                             checked={checked}
                            />
                        )}
                    </div>
                    {children}
                </animated.div>
            )}
        </Spring>
    )
}
export default ManagerCard