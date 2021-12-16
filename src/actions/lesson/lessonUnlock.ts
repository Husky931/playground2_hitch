import { ILesson } from "@pinyinma/datatypes"
import queryProjectCreate from "../../queries/queryProjectCreate"
import { setDialog } from "@pinyinma/dialog"
import { lessonIsUnlocked } from "../../state/useProjects"
import { getUser } from "../../state/useUser"

export default async (lesson: ILesson) => {
    const user = getUser()
            
    if (!user) {
        setDialog({ message: "请先注册或登录" })
        return
    }

    if (lessonIsUnlocked(lesson)) return

    await new Promise<void>(resolve => setDialog({
        message: `确定要解锁“${lesson.title}”吗？`,
        onConfirm: () => resolve()
    }))

    try {
        await queryProjectCreate({ title: lesson.title, owner: user._id, lesson: lesson._id })
    }
    catch (err: any) {
        if (!err.message.startsWith("ENOENT:"))
            throw err
        
        setDialog({ message: "课程还未同步，请稍后再试" })
    }
}