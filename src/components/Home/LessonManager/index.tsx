import React from "react"
import ManagerBase from "../utils/ManagerBase"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import SyncIcon from "@mui/icons-material/Sync"
import lessonCreate from "../../../actions/lesson/lessonCreate"
import lessonDelete from "../../../actions/lesson/lessonDelete"
import lessonSync from "../../../actions/lesson/lessonSync"
import { useLessonsSorted } from "../../../state/useLessons"
import lessonOpen from "../../../actions/lesson/lessonOpen"
import TextFormatIcon from "@mui/icons-material/TextFormat"
import lessonRename from "../../../actions/lesson/lessonRename"
import lessonReorder from "../../../actions/lesson/lessonReorder"
import { setContextMenu } from "@pinyinma/context-menu"
import lessonCreateVersion from "../../../actions/lesson/lessonCreateVersion"
import queryLessonUpdate from "../../../queries/queryLessonUpdate"

const LessonManager: React.FC<{ gradientSkip: number }> = ({ gradientSkip }) => {
    const lessons = useLessonsSorted(true, () => true, [])

    return (
        <ManagerBase
         items={lessons}
         gradientSkip={gradientSkip}
         onOpen={lessonOpen}
         buttons={[
            {
                label: "新建",
                startIcon: <AddCircleIcon />,
                edit: "none",
                onClick: () => lessonCreate()
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
         onContextMenu={item => {
             setContextMenu([
                 { text: "创建新版", onClick: () => lessonCreateVersion(item) },
                 { text: "调整顺序", onClick: () => lessonReorder(item) },
                 ...[item.hidden
                    ? { text: "显示课程" , onClick: () => queryLessonUpdate(item, { hidden: false }) }
                    : { text: "隐藏课程", onClick: () => queryLessonUpdate(item, { hidden: true }) }]
             ])
         }}
         getDisabled={item => item.hidden}
        />
    )
}

export default LessonManager