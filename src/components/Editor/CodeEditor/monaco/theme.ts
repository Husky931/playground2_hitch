import { getTheme } from "@pinyinma/playground-theme"
import { editor } from "monaco-editor"
//@ts-ignore
import data from "monaco-themes/themes/Sunburst.json"

getTheme(theme => {
    Object.assign(data.colors, {
        "editor.background": theme.customPalette.background.default,
        "editorSuggestWidget.background": theme.customPalette.background.darker1,
        "editorSuggestWidget.selectedBackground": theme.palette.secondary.dark
    })
    editor.defineTheme("playground-dark", data)
})