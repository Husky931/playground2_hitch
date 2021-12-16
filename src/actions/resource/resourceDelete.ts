import { IResource } from "@pinyinma/datatypes"
import dedent from "ts-dedent"
import { graphql } from "../../utils/http"
import itemsDialog from "../utils/itemsDialog"

export default (resources: Array<IResource>) => new Promise<void>(resolve => {
    itemsDialog(resources, "删除", async () => {
        const mutations = resources.map((resource, i) => dedent`
            resourceDelete${i}: resourceDelete(_id: "${resource._id}") {
                recordId
            }
        `).join("\n")

        await graphql(`mutation {\n${mutations}\n}`)
        resolve()
    })
})