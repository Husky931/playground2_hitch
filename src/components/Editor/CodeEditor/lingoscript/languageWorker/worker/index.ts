import { expose } from "comlink"
import { assert, between, lazy, throttle } from "@lincode/utils"
import format from "./utils/format"
import { CompletionItemKind, CompletionItemInsertTextRule } from "./monacoEnums"
import { assignableSuggestions, snippetSuggestions } from "./suggestions"
import doctrine from "doctrine"
import unquote from "./utils/unquote"
import type * as transpiler from "@pinyinma/transpiler"
import type { Legacy } from "../../../../../../state/useLegacy"
import transformResponse from "../../../../../../utils/transformResponse"
import { http } from "../../../../../../utils/http"

let legacy: Legacy | undefined

const loadTranspiler = lazy(async () => {
    assert(legacy !== undefined, "language worker not initialized")

    const t = (legacy === "0.0.1" || legacy === "1.0.0") ? (
        await import("@pinyinma/legacy-transpiler-1")
    ) : (
        await import("@pinyinma/transpiler")
    )
    t.config.silent = true
    t.config.languageService = true
    t.config.exportByDefault = true
    t.config.runtimeService = legacy !== "0.0.1"
    
    return t
})

const compileThrottled = throttle((uri: string, code: string, t: typeof transpiler) => t.compile(uri, code), 100, "trailingPromise")

let cwd = ""
const stripCWD = (uri: string) => {
    if (uri.startsWith(cwd + "/"))
        return uri.replace(cwd + "/", "")

    return uri
}

const range = undefined as unknown

const worker = {
    async compile(uri: string, code: string) {
        const t = await loadTranspiler()
        return await compileThrottled(stripCWD(uri), code, t as any)
    },

    async makeSuggestions(uri: string, code: string, line: number, column: number, triggerChar?: string) {
        uri = stripCWD(uri)

        const t = await loadTranspiler()
        await compileThrottled(uri, code, t as any)

        const { context, suggestions } = t.languageService.suggest(uri, line, column)

        if (triggerChar === " ") {
            if (!context.isOf && !context.isAssignment)
                return
            if (!context.isSpecific && !context.isOf)
                return
        }

        if ((triggerChar === "=" || triggerChar === "'" || triggerChar === '"') && !context.isSpecific)
            return

        if (triggerChar === "." && !context.isAccess)
            return

        const typeSuggestions = suggestions.map(({ name, type, doc, args }) => {
            const docParsed = doc ? doctrine.parse(doc, { unwrap: true }) : undefined
            const alias = docParsed ? between(docParsed.description, "<<", ">>") : ""
            const label = format(name, alias)
            const documentation = docParsed?.description.split("<<").join("").split(">>").join("")
            // const arg0IsString = args?.[0]?.type === "string"

            const isCall = !context.isOf && (
                type === "function" || (type === "class" && (context.isAssignment || context.isInstantiation))
            )
    
            return {
                label,
                kind: isCall ? CompletionItemKind.Function : CompletionItemKind.Variable,
                documentation,
                detail: alias,
                insertText: isCall
                    ? name + (args?.length ? "()" : "()")
                    //mark
                    // ? name + (args?.length ? "($0)" : "()")
                    : ((triggerChar === "'" || triggerChar === '"') ? unquote(name) : name)
                ,
                insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
                range
            }
        })
    
        const result = [
            ...(Object.values(context).some(v => v)
                ? ((context.isAssignment && !context.isSpecific) ? assignableSuggestions : [])
                : snippetSuggestions),
            ...typeSuggestions
        ]

        if (result.length > 0)
            return result
    },

    async compileModule(uri: string, code: string) {
        const t = await loadTranspiler()
        t.compileModule(stripCWD(uri), code)
    },

    async renameFile(from: string, to: string) {
        const t = await loadTranspiler()
        t.renameFile(stripCWD(from), stripCWD(to))
    },

    async deleteFile(uri: string) {
        const t = await loadTranspiler()
        t.deleteFile(stripCWD(uri))
    },

    async renameDir(from: string, to: string) {
        const t = await loadTranspiler()
        t.renameDir(stripCWD(from), stripCWD(to))
    },

    async deleteDir(uri: string) {
        const t = await loadTranspiler()
        t.deleteDir(stripCWD(uri))
    },

    async getDefinition(uri: string, line: number, column: number) {
        const t = await loadTranspiler()
        return t.languageService.getDefinition(stripCWD(uri), line, column)
    },

    async getInstanceProperties(uri: string, line: number) {
        const t = await loadTranspiler()
        return t.languageService.getInstanceProperties(stripCWD(uri), line)
    },
    
    async getReferences(uri: string, line: number, column: number) {
        const t = await loadTranspiler()
        return t.languageService.getReferences(stripCWD(uri), line, column)
    },

    async scanImports(uri: string, code: string) {
        const t = await loadTranspiler()
        return t.scanImports(stripCWD(uri), code)
    },

    async translate(uri: string) {
        const t = await loadTranspiler()
        return "translate" in t ? t.translate(stripCWD(uri)) : ""
    },

    async registerFiles(uris: Array<string>) {
        const t = await loadTranspiler()
        t.registerFiles(uris.map(stripCWD))
    },

    async setFetchCompile(fn: (uri: Array<string>) => Promise<void>) {
        const t = await loadTranspiler()
        t.setFetchCompile(fn)
    },

    async makeVarName() {
        const t = await loadTranspiler()
        return "makeVarName" in t ? t.makeVarName() : ""
    },

    async init(l: Legacy) {
        assert(!legacy, "language worker already initialized")
        legacy = l

        const t = await loadTranspiler()

        let declarations = ""
        if (legacy === "latest")
            declarations = (await http.get("/builtin.ls", { transformResponse })).data
        else if (legacy === "1.0.0")
            declarations = (await http.get("/legacyBuiltin1.ls", { transformResponse })).data
        else if (legacy === "0.0.1")
            declarations = (await http.get("/legacyBuiltin.ls", { transformResponse })).data
        else
            throw new Error("unexpected platform version " + legacy)

        t.compileBuiltIn(declarations)
    },

    setCWD(uri: string) {
        cwd = uri
    }
}
export default worker
expose(worker)