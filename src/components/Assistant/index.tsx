import { useTruthy } from "@lincode/hooks"
import React from "react"
import { useAssistantShow } from "../../state/useAssistantShow"
import { decreaseLoadingCount, increaseLoadingCount } from "../../state/useLoadingCount"
import UISuspense from "@pinyinma/ui-suspense"

const Assistant = React.lazy(() => import("./Assistant"))

const AssistantWrapper = () => {
    const [show] = useAssistantShow()
    const showTruthy = useTruthy(show)
    
    if (!showTruthy) return null

    return (
        <UISuspense noLoadingMask onLoading={increaseLoadingCount} onLoaded={decreaseLoadingCount}>
            <Assistant />
        </UISuspense>
    )
}

export default AssistantWrapper