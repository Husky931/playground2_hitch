import { CompletionItemKind, CompletionItemInsertTextRule } from "./monacoEnums"
import format from "./utils/format"

const range = undefined as unknown

const valueKeywords = {
    zhende: "真的",
    true: "真的",
    jiade : "假的",
    false: "假的",
    kongbai: "空白",
    undefined: "空白",
    wuqiong: "无穷",
    infinity: "无穷"
}

const operatorKeywords = {
    fanhui: "返回",
    return: "返回",
    de: "的",
    in: "的",
    // daochu: "导出",
    // export: "导出",
    daoru: "导入",
    import: "导入",
    let: "定义"
}

const assignableOperatorKeywords = {
    xin: "新",
    new: "新"
}

export const assignableSuggestions = [
    {
        label: format("leixing", "类型"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "leixing () {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("class", "类型"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "class () {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("gongneng", "功能/函数/方法"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "gongneng () {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("function", "功能/函数/方法"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "function () {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    ...Object.entries(assignableOperatorKeywords).map(([name, alias]) => ({
        label: format(name, alias),
        kind: CompletionItemKind.Keyword,
        insertText: name + " ",
        range
    })),
    ...Object.entries(valueKeywords).map(([name, alias]) => ({
        label: format(name, alias),
        kind: CompletionItemKind.Keyword,
        insertText: name,
        range
    }))
]

export const snippetSuggestions = [
    ...Object.entries(operatorKeywords).map(([name, alias]) => ({
        label: format(name, alias),
        kind: CompletionItemKind.Keyword,
        insertText: name + " ",
        range
    })),
    {
        label: format("ruguo", "如果"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "ruguo ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("if", "如果"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "if ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("fouze ruguo", "否则如果"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "fouze ruguo ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("else if", "否则如果"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "else if ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("fouze", "否则"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "fouze {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("else", "否则"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "else {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("cong", "从"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "cong ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("for", "从"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "for ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("meige", "每个"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "meige ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    {
        label: format("foreach", "每个"),
        kind: CompletionItemKind.Snippet,
        insertText: [
            "foreach ($1) {",
            "\t$0",
            "}"
        ].join("\n"),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range
    },
    ...assignableSuggestions
]