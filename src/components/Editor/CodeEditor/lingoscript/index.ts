import "./languageWorker"
import { languages } from "monaco-editor/esm/vs/editor/editor.api"
import tokensProvider from "./tokensProvider"
import languageConfiguration from "./languageConfiguration"
import completionItemProvider from "./completionItemProvider"
import definitionProvider from "./definitionProvider"
import referenceProvider from "./referenceProvider"

languages.register({ id: "lingoscript" })
languages.setMonarchTokensProvider("lingoscript", tokensProvider)
languages.setLanguageConfiguration("lingoscript", languageConfiguration)
languages.registerCompletionItemProvider("lingoscript", completionItemProvider)
// languages.registerDefinitionProvider("lingoscript", definitionProvider)
// languages.registerReferenceProvider("lingoscript", referenceProvider)