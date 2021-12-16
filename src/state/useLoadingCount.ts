import store from "@lincode/react-global-state"

const [useLoadingCount, setLoadingCount, getLoadingCount] = store(0)
export { useLoadingCount }

export const increaseLoadingCount = () => setLoadingCount(getLoadingCount() + 1)

export const decreaseLoadingCount = () => setLoadingCount(getLoadingCount() - 1)