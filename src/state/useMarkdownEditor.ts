import store from "@lincode/react-global-state"

type Options = {
    markdown?: string,
    onConfirm?: (markdown: string) => Promise<void> | void,
    fullscreen?: boolean
}

export const [useMarkdownEditor, setMarkdownEditor, getMarkdownEditor] = store<Options | undefined>(undefined)