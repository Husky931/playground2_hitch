import { ILesson } from "@pinyinma/datatypes"
import queryProjectUpdate from "../../queries/queryProjectUpdate"
import { setDialog } from "@pinyinma/dialog"
import { unlockedLessonIdProjectMap } from "../../state/useProjects"
import { getUser } from "../../state/useUser"

export default (lesson: ILesson) => {
    return new Promise<void>(resolve => {
        const user = getUser()
                
        if (!user) {
            setDialog({ message: "请先注册或登录" })
            return
        }
        
        setDialog({
            message: `当前用户是“${user.name ?? user.username}”`,
            onConfirm: () => {
                setDialog({
                    message: `确定要重置“${lesson.title}”吗？`,
                    onConfirm: async () => {
                        const project = unlockedLessonIdProjectMap.get(lesson._id)
                        if (!project) return
                
                        await queryProjectUpdate(project, { deleted: true })
                        resolve()
                    }
                })
            }
        })
    })
}