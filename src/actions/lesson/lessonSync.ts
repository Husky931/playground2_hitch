import { ILesson } from "@pinyinma/datatypes"
import dedent from "ts-dedent"
import { graphql } from "../../utils/http"
import itemsDialog from "../utils/itemsDialog"

export default (lessons: Array<ILesson>) => {
    itemsDialog(lessons, "同步", async () => {
        const mutations = lessons.map((lesson, i) => dedent`
            lessonSync${i}: lessonSync(_id: "${lesson._id}") {
                recordId
            }
        `).join("\n")

        await graphql(`mutation {\n${mutations}\n}`)
    })
}