import store from "@lincode/react-global-state"

export const [useGameEditorTool, setGameEditorTool, getGameEditorTool] = store<"translate" | "rotate" | "scale">("translate")