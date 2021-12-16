import React, { useEffect } from "react"
import { BaseNode, initBaseNodes, setGameEditorGraph, useGameEditorGraph } from "../../../state/useGameEditorGraph"
import GameComponent from "./GameComponent"
import { useGameEditorTab } from "../../../state/useGameEditorTab"
import { getGameEditorGraphs } from "../../../state/useGameEditorGraphs"
import fetchGameFile from "./fetchGameFile"
import type { AnimationNode } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"
import { refreshGameEditorSelection } from "../../../events/onGameEditorSelection"
import { tryParse } from "@lincode/utils"

const recursiveGameComponent = (baseNodes?: Array<BaseNode>) => baseNodes?.map(baseNode => (
    <GameComponent key={baseNode.uuid} node={baseNode}>
        {recursiveGameComponent(baseNode.children)}
    </GameComponent>
))

const Game: React.FC = () => {
    const [{ baseNodes }] = useGameEditorGraph()
    const [tab] = useGameEditorTab()
    
    useEffect(() => {
        if (!tab) return

        const sceneGraph = getGameEditorGraphs()[tab]
        if (sceneGraph) {
            setGameEditorGraph(sceneGraph)
            refreshGameEditorSelection()
            return
        }

        let signal = true

        fetchGameFile(tab).then(data => {
            if (!signal || !data)
                return setGameEditorGraph({ baseNodes: [], animationNodes: [] })

            const rawGraph: Array<AnimationNode | BaseNode> | undefined = tryParse(data)

            if (!Array.isArray(rawGraph))
                return setGameEditorGraph({ baseNodes: [], animationNodes: [] })

            const baseNodes: Array<BaseNode> = []
            const animationNodes: Array<AnimationNode> = []
            
            for (const node of rawGraph)
                if (node.type === "animation")
                    animationNodes.push(node)
                else
                    baseNodes.push(node)

            initBaseNodes(baseNodes)
            setGameEditorGraph({ baseNodes, animationNodes })
            refreshGameEditorSelection()
        })

        return () => {
            signal = false
        }
    }, [tab])

    return <>{recursiveGameComponent(baseNodes)}</>
}

export default Game