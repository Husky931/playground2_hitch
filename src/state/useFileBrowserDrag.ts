import store from "@lincode/react-global-state"

export const [useFileBrowserDrag, setFileBrowserDrag, getFileBrowserDrag] = store<string | undefined>(undefined)