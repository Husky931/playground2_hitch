import React, { useRef, useLayoutEffect } from "react"
import { useConsoleData, pushConsoleData } from "../../../../state/useConsoleData"
import { Container } from "@mui/material"
import { emitPreviewFullScreen } from "../../../../events/onPreviewFullScreen"

const REPL: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
    const [consoleData] = useConsoleData()

    const inputRef = useRef<HTMLInputElement>(null)
    const divRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        divRef.current && (divRef.current.scrollTop = divRef.current.scrollHeight)
    }, [consoleData])

    return (
        <Container
         className="w-full h-full pt-2 pb-6 cursor-text overflow-y-scroll opacity-50"
         style={style}
         onClick={() => inputRef.current?.focus()}
         ref={divRef}
        >
            {consoleData[0].map((d, i) => (
                <div key={i}>
                    {d.prefix && <span className="text-red-400 mr-2">{d.prefix}</span>}
                    <span>{d.message}</span>
                </div>
            ))}
            <div className="flex">
                <div className="text-red-400 mr-2">{">"}</div>
                <input className="flex-grow bg-transparent" ref={inputRef} onKeyDown={e => {
                    if (e.key === "Enter") {
                        e.currentTarget.value === "fullscreen" && emitPreviewFullScreen()
                        pushConsoleData({ prefix: `>`, message: e.currentTarget.value })
                        e.currentTarget.value = ""
                    }
                }} />
            </div>
        </Container>
    )
}

export default REPL