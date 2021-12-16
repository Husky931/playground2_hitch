import store, { assign } from "@lincode/react-global-state"

type Options = {
    src?: string | Array<[string, File]> | File
    onSave?: () => void
}

export const [useModelViewer, setModelViewer, getModelViewer] = store<Options | undefined>(undefined)

export const assignModelViewer = assign(setModelViewer, getModelViewer)