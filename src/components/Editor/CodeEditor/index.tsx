import React, { useMemo, useState } from "react"
import Tabs from "./Tabs"
import { controls } from "./Code"
import { IScrollEvent } from "monaco-editor/esm/vs/editor/editor.api"
import { useFileLoading } from "../../../state/useFileLoading"
import { getCodeTab, useCodeTab } from "../../../state/useCodeTab"
import { debounce } from "@lincode/utils"
import { setPreviewCode } from "../../../state/usePreviewCode"
import "./lingoscript"
import { useDirTree } from "../../../state/useDirTree"
import { getAbsoluteURI } from "../../../utils/uriGetters"
import { getCodeStepsRender, useCodeStepsRender } from "../../../state/useCodeStepsRender"
import { Border, LoadingMask } from "@pinyinma/components"
import UISuspense from "@pinyinma/ui-suspense"
import { useCodeTranslation } from "../../../state/useCodeTranslation"
import Code from "./Code"

const CodeSteps = React.lazy(() => import("./CodeSteps"))
const VisualScripting = React.lazy(() => import("./VisualScripting"))
const CodeTranslation = React.lazy(() => import("./CodeTranslation"))

export const save = async () => {
    if (!getCodeStepsRender()) {
        controls.save()
        return
    }
    const { diffControls } = await import("./CodeSteps")
    diffControls.save()
}
export const newLine = async () => {
    if (!getCodeStepsRender()) {
        controls.newLine()
        return
    }
    const { diffControls } = await import("./CodeSteps")
    diffControls.newLine()
}
export const undo = async () => {
    if (!getCodeStepsRender()) {
        controls.undo()
        return
    }
    const { diffControls } = await import("./CodeSteps")
    diffControls.undo()
}
export const redo = async () => {
    if (!getCodeStepsRender()) {
        controls.redo()
        return
    }
    const { diffControls } = await import("./CodeSteps")
    diffControls.redo()
}

const handleDiffSave = debounce((code: string) => {
    const uri = getAbsoluteURI("app.ls")
    getCodeTab() === uri && setPreviewCode({ code, uri })

}, 500, "leading")

const handleTranslationScrollChange = async (e: IScrollEvent) => {
    const { controls } = await import("./CodeTranslation")
    controls.setScrollTop(e.scrollTop)
    controls.setScrollLeft(e.scrollLeft)
}

const CodeEditor: React.FC<{ style: React.CSSProperties }> = props => {
    const [tab] = useCodeTab()
    const [loading] = useFileLoading()
    const [dirTree] = useDirTree()
    const [stepsRender] = useCodeStepsRender()
    const [translation] = useCodeTranslation()
    const [loadingCount, setLoadingCount] = useState(0)

    const visualScripting = useMemo(() => tab?.endsWith(".lvs"), [tab])

    const handleLoading = () => setLoadingCount(loadingCount + 1)
    const handleLoaded = () => setLoadingCount(loadingCount - 1)

    return (
        <div className="flex flex-col" style={props.style}>
            <Tabs />
            <div className="flex-grow">
                {stepsRender ? (
                    <UISuspense noLoadingMask onLoading={handleLoading} onLoaded={handleLoaded}>
                        <CodeSteps className="absfull" onSave={handleDiffSave} />
                    </UISuspense>
                ) : visualScripting ? (
                    <UISuspense noLoadingMask onLoading={handleLoading} onLoaded={handleLoaded}>
                        <VisualScripting className="absfull" />
                    </UISuspense>
                ) : translation ? (
                    <div className="w-full h-full flex">
                        <div className="w-1/2 h-full">
                            <Code onScrollChange={handleTranslationScrollChange} />
                        </div>
                        <div className="w-1/2 h-full">
                            <UISuspense noLoadingMask onLoading={handleLoading} onLoaded={handleLoaded}>
                                <CodeTranslation />
                            </UISuspense>
                        </div>
                    </div>
                ) : (
                    <Code />
                )}
                <Border />
                <LoadingMask show={loadingCount > 0 || !dirTree || !!(tab && loading[tab])} />
            </div>
            <Border horizontal />
        </div>
    )
}

export default CodeEditor