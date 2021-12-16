import { createEffect, refresh } from "@lincode/react-global-state"
import autoResetStore from "./utils/autoResetStore"
import { getAssistantGraphNode } from "./useAssistantGraphNode"
import { getCodeStepsRender } from "./useCodeStepsRender"
import { getCodeTab } from "./useCodeTab"
import { fetchCodeFile } from "../components/Editor/CodeEditor/lingoscript/languageWorker/fetchCompile"
import guid from "@pinyinma/guid"

export const [, setPreviewCode, getPreviewCode] = autoResetStore<{ code: string, uri: string } | undefined>(undefined)
export const refreshPreviewCode = refresh(setPreviewCode, getPreviewCode)

//todo: move below logic into preview component

createEffect(() => {
    if (getCodeStepsRender()) return

    const uri = getCodeTab()

    if (uri) {
        let signal = true
        !uri.endsWith(".lvs") && fetchCodeFile(uri).then(code => signal && setPreviewCode({ uri, code }))

        return () => {
            signal = false
        }
    }
    setPreviewCode(undefined)
        
}, [getCodeStepsRender, getCodeTab])

getAssistantGraphNode(node => {
    setTimeout(() => {
        node?.action?.previewCode && setPreviewCode({ uri: guid + "preview", code: node.action.previewCode })
    })
})