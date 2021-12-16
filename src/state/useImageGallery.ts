import store, { assign } from "@lincode/react-global-state"

type Options = {
    src?: Array<[string, File]>
    onSave?: () => void
}

export const [useImageGallery, setImageGallery, getImageGallery] = store<Options | undefined>(undefined)

export const assignImageGallery = assign(setImageGallery, getImageGallery)