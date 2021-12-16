import React, { useMemo } from "react"
import { assignFileUnsaved, getFileUnsaved, omitFileUnsaved } from "../../../state/useFileUnsaved"
import fileUpdate from "../../../actions/file/fileUpdate"
import { setInstanceInspector } from "../../../state/useInstanceInspector"
import languageWorker, { languageWorkerCompileModule } from "./lingoscript/languageWorker"
import { getRelativeURI } from "../../../utils/uriGetters"
import { setFocus } from "../../../state/useFocus"
import liveCompile from "./lingoscript/languageWorker/liveCompile"
import { fetchCodeFile } from "./lingoscript/languageWorker/fetchCompile"
import { editor, IScrollEvent } from "monaco-editor"
import { getCodeTab, useCodeTab, useCodeTabs } from "../../../state/useCodeTab"
import { useFileContent } from "../../../state/useFileContent"
import { setPreviewCode } from "../../../state/usePreviewCode"
import { debounce } from "@lincode/utils"
import makeMonaco from "./monaco/makeMonaco"
import { useCodeFontSize } from "../../../state/useCodeFontSize"

export const { Monaco, controls } = makeMonaco()

const handleSave = debounce((code: string, uri: string) => {
    if (uri in getFileUnsaved()) {
        omitFileUnsaved(uri)
        fileUpdate(uri, code)
    }
    getCodeTab() === uri && setPreviewCode({ code, uri })

}, 500, "leading")

const handleSaveAll = debounce(async (entries: Array<[string, string]>) => {
    const FileUnsaved = getFileUnsaved()
    for (const [uri, code] of entries) {
        if (!(uri in FileUnsaved)) continue

        omitFileUnsaved(uri)
        await fileUpdate(uri, code)
    }
    const uri = getCodeTab()
    uri && fetchCodeFile(uri).then(code => setPreviewCode({ code, uri }))

}, 500, "leading")

const handleChange = () => {
    const codeTab = getCodeTab()
    codeTab && assignFileUnsaved({ [codeTab]: true })
    liveCompile()
}

const handleModelChange = async (e: editor.IModelChangedEvent) => {
    if (e.oldModelUrl)
        languageWorkerCompileModule(e.oldModelUrl.path, editor.getModel(e.oldModelUrl)?.getValue() ?? "")

    liveCompile()
}

const handleRightClick = async () => {
    const position = controls.getEditor()?.getPosition()
    if (!position) return

    const uri = getRelativeURI(controls.getURI())
    setInstanceInspector(await languageWorker.getInstanceProperties(uri, position.lineNumber))
}

const handleFocus = () => setFocus(".lingo-monaco")

const handleBlur = () => setFocus(undefined)

const Code: React.FC<{ onScrollChange?: (e: IScrollEvent) => void }> = ({ onScrollChange }) => {
    const [content] = useFileContent()
    const [tab] = useCodeTab()
    const [tabs] = useCodeTabs()
    const [fontSize] = useCodeFontSize()

    const files = useMemo(() => {
        const obj: Record<string, Promise<string>> = {}
        for (const [key, value] of Object.entries(content))
            tabs.includes(key) && (obj[key] = value)
        return obj

    }, [content, tabs])

    return (
        <Monaco
         className="lingo-monaco absfull"
         theme="playground-dark"
         languages={{
             ls: "lingoscript", js: "javascript", ts: "typescript", py: "python", html: "html", css: "css"
         }}
         fontSize={fontSize}
         files={files}
         file={tab}
         onChange={handleChange}
         onModelChange={handleModelChange}
         onSave={handleSave}
         onSaveAll={handleSaveAll}
         onContextMenu={handleRightClick}
         onFocus={handleFocus}
         onBlur={handleBlur}
         onScrollChange={onScrollChange}
        />
    )
}

export default Code