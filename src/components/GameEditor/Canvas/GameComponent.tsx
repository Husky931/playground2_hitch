import { omit } from "@lincode/utils"
import { useState, useLayoutEffect, createContext, useContext } from "react"
import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import type { GameObjectType } from "@pinyinma/gamelib/lib/display/utils/deserialize/types"
import { BaseNode, nonDisplayProperties } from "../../../state/useGameEditorGraph"
import React from "react"

export const instanceNodeMap = new WeakMap<SimpleObjectManager, BaseNode>()
export const nodeInstanceMap = new WeakMap<BaseNode, SimpleObjectManager>()
export const uuidNodeInstanceMap = new Map<string, { node: BaseNode, instance: SimpleObjectManager }>()

export type CreateObject = (name: GameObjectType) => SimpleObjectManager
export const CreateObjectContext = createContext<CreateObject>(undefined as any)

const GameComponent: React.FC<{ node: BaseNode }> = ({ node, children }) => {
    const createObject = useContext(CreateObjectContext)

    const [instance] = useState(() => {
        const instance = createObject(node.type)
        instanceNodeMap.set(instance, node)
        nodeInstanceMap.set(node, instance)
        return instance
    })

    useLayoutEffect(() => {
        if (node.children)
            for (const child of node.children)
                instance.append(nodeInstanceMap.get(child)!)
               
        uuidNodeInstanceMap.set(node.uuid, { node, instance })

        return () => {
            instance.dispose()
            uuidNodeInstanceMap.delete(node.uuid)
        }
    }, [])

    useLayoutEffect(() => {
        Object.assign(instance, omit(node, nonDisplayProperties))
    }, [node.update])

    return <>{children}</>
}

export default GameComponent