import { languages, Range } from "monaco-editor/esm/vs/editor/editor.api"
import languageWorker from "./languageWorker"
import { controls } from "../Code"

export default <languages.DefinitionProvider>{
    async provideDefinition(model, position) {
        const range = await languageWorker.getDefinition(model.uri.path, position.lineNumber, position.column)
        if (!range) return

        return {
            range: new Range(range.lineStart, range.columnStart, range.lineEnd, range.columnEnd),
            uri: controls.getURI()
        }
    }
}