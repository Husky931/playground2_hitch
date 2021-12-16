import React, { useMemo } from "react"
import { useConsoleVisible } from "../../../../state/useConsoleVisible"
import ConsoleToolbar from "./ConsoleToolbar"
import ErrorTree from "./ErrorTree"
import { useCodeErrors } from "../../../../state/useCodeErrors"
import REPL from "./REPL"
import { useFileBrowserHeight } from "../../../../state/useFileBrowserHeight"

const Console: React.FC = () => {
    const [consoleVisible] = useConsoleVisible()
    const [codeErrors] = useCodeErrors()
    const [height] = useFileBrowserHeight()
    
    const numErrors = useMemo(() => Object.values(codeErrors).reduce((r, v) => r + v.length, 0), [codeErrors])
    
    return (
        <div className="lingo-console flex flex-col" style={{
            height: consoleVisible ? height : undefined
        }}>
            <ConsoleToolbar numErrors={numErrors} />
            <ErrorTree style={{ display: consoleVisible && numErrors > 0 ? "block" : "none" }} />
            <REPL style={{ display: consoleVisible && numErrors === 0 ? "block" : "none" }} />
        </div>
    )
}

export default Console