import { ILesson } from "@pinyinma/datatypes"
import { setDialog } from "@pinyinma/dialog"
import { setProject } from "../../state/useProject"
import { getProjects } from "../../state/useProjects"

export default (lesson: ILesson) => {
    const project = getProjects().find(p => p.lesson === lesson._id && !p.deleted)

    if (!project) {
        setDialog({ message: "课程还没有被解锁" })
        return
    }
    setProject(project)
}