import dedent from "ts-dedent"
import { getLessonEditor } from "../../state/useLessonEditor"
import { SerializedNode, SerializedEdge } from "../../components/LessonEditor/Chart/types"
import { graphql } from "../../utils/http"

export default async (data: Array<SerializedNode | SerializedEdge>) => {
    const lesson = getLessonEditor()
    if (!lesson) return

    await graphql(dedent`
        mutation {
            lessonDialog(_id: "${lesson._id}", data: """|${JSON.stringify(data)}|""") {
                recordId
            }
        }
    `)
}