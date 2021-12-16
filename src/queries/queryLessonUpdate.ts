import { ILesson } from "@pinyinma/datatypes"
import { refreshLessons } from "../state/useLessons"
import { graphqlTypedPartial } from "../utils/http"

export default async (lesson: ILesson, params: Partial<ILesson>) => {
    Object.assign(lesson, await graphqlTypedPartial<ILesson>(
        "mutation",
            "lessonUpdate", { _id: lesson._id, ...params }, params
        )
    )
    refreshLessons()
}