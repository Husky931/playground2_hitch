import dedent from "ts-dedent"
import { setCodeStep } from "../../state/useCodeStep"
import { getCodeSteps, pushCodeSteps } from "../../state/useCodeSteps"
import { getProject } from "../../state/useProject"
import { graphql } from "../../utils/http"

export default async () => {
    const lessonId = getProject()?.lesson
    if (!lessonId) return

    setCodeStep(getCodeSteps()?.length ?? 0)

    const { diffControls } = await import("../../components/Editor/CodeEditor/CodeSteps")
    pushCodeSteps(diffControls.getModifiedValue())

    await graphql(dedent`
        mutation {
            lessonSteps(_id: "${lessonId}", content: """|${JSON.stringify(getCodeSteps())}|""") {
                recordId
            }
        }
    `)
}