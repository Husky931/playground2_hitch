import type { languages } from "monaco-editor/esm/vs/editor/editor.api"
import languageWorker from "./languageWorker"

export default <languages.CompletionItemProvider>{
    async provideCompletionItems(model, position, context) {
        return {
            suggestions: await languageWorker.makeSuggestions(
                model.uri.path,
                model.getValue(),
                position.lineNumber,
                position.column,
                context.triggerCharacter
            )
        }
    },
    triggerCharacters: [".", '"', "'", " ", "="]
}