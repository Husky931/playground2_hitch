import { ILesson } from "@pinyinma/datatypes"
import dedent from "ts-dedent"
import { filterLessons } from "../../state/useLessons"
import { graphql } from "../../utils/http"
import itemsDialog from "../utils/itemsDialog"

export default (lessons: Array<ILesson>) => {
    itemsDialog(lessons, "删除", async () => {
        const mutations = lessons.map((lesson, i) => dedent`
            lessonDelete${i}: lessonDelete(_id: "${lesson._id}") {
                recordId
            }
        `).join("\n")

        const result = await graphql(`mutation {\n${mutations}\n}`)

        const lessonDeletes: Array<{ recordId: string }> = Object.values(result)
        filterLessons(lesson => !lessonDeletes.some(l => lesson._id === l.recordId))
    })
}