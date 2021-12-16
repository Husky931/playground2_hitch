import React from "react"
import ManagerBase from "../utils/ManagerBase"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import TextFormatIcon from "@mui/icons-material/TextFormat"
import SyncIcon from "@mui/icons-material/Sync"
import lessonOpen from "../../../actions/lesson/lessonOpen"
import lessonCreate from "../../../actions/lesson/lessonCreate"
import lessonDelete from "../../../actions/lesson/lessonDelete"
import lessonRename from "../../../actions/lesson/lessonRename"
import lessonSync from "../../../actions/lesson/lessonSync"
import { useAdmin } from "../../../state/useAdmin"
import lessonContextMenu from "../../../actions/lesson/lessonContextMenu"
import { lessonIsUnlocked, useProjects } from "../../../state/useProjects"
import lessonUnlock from "../../../actions/lesson/lessonUnlock"
import { useLessonsSorted } from "../../../state/useLessons"

const WebLessons: React.FC<{ gradientSkip: number }> = ({ gradientSkip }) => {
    const [admin] = useAdmin()
    const lessons = useLessonsSorted(false, () => admin, [admin])
    useProjects()

    return (
        <ManagerBase
         items={lessons}
         gradientSkip={gradientSkip}
         onOpen={lessonOpen}
         onContextMenu={lessonContextMenu}
         title="在线课程"
         buttons={!admin ? undefined : [
            {
                label: "新建",
                startIcon: <AddCircleIcon />,
                edit: "none",
                onClick: () => lessonCreate(true)
            },
            {
                label: "删除",
                startIcon: <DeleteIcon />,
                edit: "many",
                onClick: lessonDelete
            },
            {
                label: "重命名",
                startIcon: <TextFormatIcon />,
                edit: "one",
                onClick: items => lessonRename(items[0])
            },
            {
                label: "同步",
                startIcon: <SyncIcon />,
                edit: "many",
                onClick: lessonSync
            }
         ]}
         getLocked={item => !lessonIsUnlocked(item)}
         onUnlock={item => lessonUnlock(item)}
        />
    )
}

export default WebLessons