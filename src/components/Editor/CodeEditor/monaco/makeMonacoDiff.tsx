import { useResizeObserver } from "@lincode/hooks"
import { assert } from "@lincode/utils"
import { editor, KeyCode, KeyMod } from "monaco-editor"
import React, { useEffect, useRef } from "react"

export default () => {
    let currentEditor: editor.IStandaloneDiffEditor | undefined
    let currentOnSave: ((code: string) => void) | undefined
    let currentOnUndo: (() => void) | undefined
    let currentOnRedo: (() => void) | undefined

    let modifiedModel: editor.ITextModel | undefined
    let originalModel: editor.ITextModel | undefined

    const MonacoDiff: React.FC<{
        style?: React.CSSProperties,
        className?: string,
        theme?: string,
        minimap?: boolean,
        fontSize?: number,
        language?: string,
        originalText?: string,
        modifiedText?: string,
        onSave?: (code: string) => void,
        onUndo?: () => void,
        onRedo?: () => void

    }> = ({ style, className, theme, minimap, fontSize, language, originalText, modifiedText = "", onSave, onUndo, onRedo }) => {

        const editorDivRef = useRef<HTMLDivElement>(null)

        currentOnSave = onSave
        currentOnUndo = onUndo
        currentOnRedo = onRedo

        useEffect(() => {
            currentEditor?.updateOptions({
                minimap: { enabled: minimap },
                fontSize
            })
        }, [minimap, fontSize])

        useEffect(() => {
            const el = editorDivRef.current
            assert(el)

            const editorInstance = currentEditor = editor.createDiffEditor(el, {
                theme,
                minimap: { enabled: minimap },
                fontSize,
                contextmenu: false,
                renderSideBySide: false
            })

            const original = originalModel = editor.createModel("", language)
            const modified = modifiedModel = editor.createModel("", language)

            editorInstance.setModel({ original, modified })

            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, () => {
                currentOnSave?.(modified.getValue())
            })
            
            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_Z, () => {
                currentOnUndo?.()
                editorInstance.trigger("monaco", "undo", undefined)
            })

            editorInstance.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_Y, () => {
                currentOnRedo?.()
                editorInstance.trigger("monaco", "redo", undefined)
            })

            return () => {
                editorInstance.dispose()
            }
        }, [])

        useEffect(() => {
            originalModel?.setValue(originalText ?? modifiedText)
            modifiedModel?.setValue(modifiedText)

        }, [originalText, modifiedText])

        const [observeResize] = useResizeObserver(() => currentEditor?.layout())
            
        return(
            <div style={style} className={className} ref={observeResize}>
                <div className="nofix w-full h-full select-auto" ref={editorDivRef} />
            </div>
        )
    }

    const diffControls = {
        getModifiedValue: () => modifiedModel?.getValue() ?? "",

        save: () => {
            modifiedModel && currentOnSave?.(modifiedModel.getValue())
            currentEditor?.focus()
        },

        newLine: () => {
            currentEditor?.trigger("monaco", "editor.action.insertLineAfter", undefined)
            currentEditor?.focus()
        },

        undo: () => {
            currentEditor?.trigger("monaco", "undo", undefined)
            currentEditor?.focus()
        },

        redo: () => {
            currentEditor?.trigger("monaco", "redo", undefined)
            currentEditor?.focus()
        }
    }

    return { MonacoDiff, diffControls }
}