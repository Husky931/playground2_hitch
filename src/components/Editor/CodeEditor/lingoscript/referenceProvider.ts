import { languages, Range } from "monaco-editor/esm/vs/editor/editor.api"
import languageWorker from "./languageWorker"
import { controls } from "../Code"

export default <languages.ReferenceProvider>{
    async provideReferences(model, position) {
        const ranges = await languageWorker.getReferences(model.uri.path, position.lineNumber, position.column)
        
        return ranges?.map(r => ({
            range: new Range(r.lineStart, r.columnStart, r.lineEnd, r.columnEnd),
            uri: controls.getURI()
        }))
    }
}