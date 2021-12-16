import { ILesson } from "@pinyinma/datatypes"
import { pushLessons } from "../state/useLessons"
import { graphqlTyped } from "../utils/http"

export default async(params: Partial<ILesson>) => {
    pushLessons(await graphqlTyped<ILesson>(
        "mutation",
            "lessonCreate", params, {
                _id: true,
                title: true,
                isWebLesson: true,
                hidden: true,
                original: true,
                previous: true,
                createdAt: true
            }
        )
    )
}