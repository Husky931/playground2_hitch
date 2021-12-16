import { debounce, keepOne } from "@lincode/utils"
import { editor, MarkerSeverity } from "monaco-editor"
import languageWorker, { languageWorkerCompile } from "."
import { setCodeErrors, CodeError } from "../../../../../state/useCodeErrors"
import { getCodeTranslation } from "../../../../../state/useCodeTranslation"
import { setCodeTranslationContent } from "../../../../../state/useCodeTranslationContent"
import { setCodeTyping } from "../../../../../state/useCodeTyping"
import { getRelativeURI } from "../../../../../utils/uriGetters"
import { controls } from "../../Code"

let currentEdge: "leading" | "trailing" = "leading"

export default debounce(async () => {
    const model = controls.getModel()

    if (currentEdge === "leading") {
        currentEdge = "trailing"
        model && editor.setModelMarkers(model, "monaco", [])
        controls.clearHighlight()
        setCodeTyping(true)
        return
    }
    currentEdge = "leading"

    if (!model || model !== controls.getModel()) return

    const [, errorStore] = await languageWorkerCompile(model.uri.path, model.getValue())

    setCodeErrors([...errorStore]
        .filter(([, errors]) => errors.length)
        .reduce<Record<string, Array<CodeError>>>((acc, [uri, errors]) => (acc[uri] = keepOne(errors), acc), {}))

    const markers = keepOne(errorStore.get(getRelativeURI(model.uri.path))?.map(({ message, token }) => ({
        severity: MarkerSeverity.Error,
        message,
        startLineNumber: token.line,
        endLineNumber: token.line,
        startColumn: 1,
        endColumn: Infinity
    })))

    editor.setModelMarkers(model, "monaco", markers)
    getCodeTranslation() && setCodeTranslationContent(await languageWorker.translate(model.uri.path))
    setCodeTyping(false)

}, 500, "both")