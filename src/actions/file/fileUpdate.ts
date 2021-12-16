import { assignFileContent } from "../../state/useFileContent"
import dedent from "ts-dedent"
import { assignFileUpdating, omitFileUpdating } from "../../state/useFileUpdating"
import { graphql } from "../../utils/http"

export default async (location: string, code: string) => {
    assignFileUpdating({ [location]: true })
    assignFileContent({ [location]: Promise.resolve(code) })

    await graphql(dedent`
        mutation {
            projectFile(location: "${location}", content: """|${code}|""", update: true) {
                recordId
            }
        }
    `, false)
    omitFileUpdating(location)
}