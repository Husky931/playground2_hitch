import React, { useEffect } from "react"
import { getCodeTranslationContent } from "../../../state/useCodeTranslationContent"
import { useCodeTranslation } from "../../../state/useCodeTranslation"
import { LoadingMask } from "@pinyinma/components"
import { useCodeTyping } from "../../../state/useCodeTyping"
import makeMonaco from "./monaco/makeMonaco"
import { useCodeFontSize } from "../../../state/useCodeFontSize"

const { Monaco, controls } = makeMonaco()
export { controls }

const translationFiles = {
    "translation.ls": Promise.resolve("")
}

const CodeTranslation: React.FC = () => {
    const [translation] = useCodeTranslation()
    const [typing] = useCodeTyping()
    const [fontSize] = useCodeFontSize()

    useEffect(() => {
        if (!translation) return

        const handle = getCodeTranslationContent(controls.setValue)

        return () => {
            handle.cancel()
        }
    }, [translation])

    return (
        <>
            <Monaco
             className="absfull"
             theme="playground-dark"
             language="lingoscript"
             fontSize={fontSize}
             files={translationFiles}
             file="translation.ls"
            />
            <LoadingMask show={typing} />
        </>
    )
}

export default CodeTranslation