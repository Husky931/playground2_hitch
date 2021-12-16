import store from "@lincode/react-global-state"

export const [useClientId, setClientId, getClientId] = store<string | undefined>(undefined)