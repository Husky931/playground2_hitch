import autoResetStore from "./utils/autoResetStore"

const getHeight = () => Math.max(Math.min(window.innerHeight * 0.25, 200), 155)

const [useFileBrowserHeight, setFileBrowserHeight] = autoResetStore(getHeight())
export { useFileBrowserHeight }

window.addEventListener("resize", () => setFileBrowserHeight(getHeight()))