import React from "react"
import { useEffect } from "react"
import { useCodeFontSize } from "../../../state/useCodeFontSize"
import { useCodeStep } from "../../../state/useCodeStep"
import { useCodeSteps } from "../../../state/useCodeSteps"
import { setPreviewCode } from "../../../state/usePreviewCode"
import { getAbsoluteURI } from "../../../utils/uriGetters"
import makeMonacoDiff from "./monaco/makeMonacoDiff"

const { MonacoDiff, diffControls } = makeMonacoDiff()
export { diffControls }

const CodeSteps: React.FC<{ className: string, onSave?: (code: string) => void }> = ({ className, onSave }) => {
    const [codeSteps] = useCodeSteps()
    const [codeStep] = useCodeStep()
    const [fontSize] = useCodeFontSize()
    
    const originalText = codeSteps?.[codeStep - 1]
    const modifiedText = codeSteps?.[codeStep]

    useEffect(() => {
        setPreviewCode({ code: modifiedText ?? "", uri: getAbsoluteURI("app.ls") })
    }, [modifiedText])

    return (
        <MonacoDiff
         className={className}
         theme="playground-dark"
         language="lingoscript"
         fontSize={fontSize}
         originalText={originalText}
         modifiedText={modifiedText}
         onSave={onSave}
        />
    )
}

export default CodeSteps