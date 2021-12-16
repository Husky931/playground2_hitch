import { IProject } from "@pinyinma/datatypes"
import dedent from "ts-dedent"
import { refreshProjects } from "../../state/useProjects"
import { graphql } from "../../utils/http"
import itemsDialog from "../utils/itemsDialog"

export default (projects: Array<IProject>) => {
    itemsDialog(projects, "删除", async () => {
        const mutations = projects.map((project, i) => dedent`
            projectUpdate${i}: projectUpdate(_id: "${project._id}", deleted: true) {
                recordId
                record {
                    deleted
                }
            }
        `).join("\n")

        const result = await graphql(`mutation {\n${mutations}\n}`)

        for (const projectUpdate of Object.values<any>(result))
            Object.assign(projects.find(p => p._id === projectUpdate.recordId), projectUpdate.record)

        refreshProjects()
    })
}