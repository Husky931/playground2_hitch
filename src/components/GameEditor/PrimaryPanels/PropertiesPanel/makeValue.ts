import type SimpleObjectManager from "@pinyinma/gamelib/lib/display/core/SimpleObjectManager"
import { BaseNode, userUpdateBaseNodes } from "../../../../state/useGameEditorGraph"
import toFixed from "../../../../utils/toFixed"
import isMultipleSelectionGroup from "../../utils/isMultipleSelectionGroup"

type MakeValueOptions<T> = Record<string, any> & { format?: (val: T) => T }

export default <T>(
    t: SimpleObjectManager, nodes: Array<BaseNode | undefined>, propName: string, defaultValue: T, folder: string, options?: MakeValueOptions<T>
) => {
    let value: any = defaultValue
    if (isMultipleSelectionGroup(t)) {
        //@ts-ignore
        const first = nodes[0]?.[propName]
        //@ts-ignore
        if (nodes.every(n => n?.[propName] === first))
            value = first ?? defaultValue
        else
            value = defaultValue
    }
    //@ts-ignore
    else value = nodes[0]?.[propName] ?? defaultValue

    options?.format && (value = options.format(value))
    typeof value === "number" && (value = toFixed(value))

    return <const>[value, {
        ...options, folder,
        onChange: (e: any) => userUpdateBaseNodes(() => nodes.map(node => [node, { [propName]: e.value }]))
    }]
}