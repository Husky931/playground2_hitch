import store, { refresh } from "@lincode/react-global-state"
import { Edge, Node } from "react-flow-renderer"
import { NodeData } from "../components/Editor/CodeEditor/VisualScripting/compilePreview/types"

type Data = {
    nodes: Array<Node<NodeData>>
    edges: Array<Edge>
}

export const [useVisualScriptingGraph, setVisualScriptingGraph, getVisualScriptingGraph] = store<Data>({ nodes: [], edges: [] })

export const refreshVisualScriptingGraph = refresh(setVisualScriptingGraph, getVisualScriptingGraph)