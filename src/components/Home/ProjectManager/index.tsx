import React from "react"
import { useProjects } from "../../../state/useProjects"
import ManagerBase from "../utils/ManagerBase"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import DeleteIcon from "@mui/icons-material/Delete"
import TextFormatIcon from "@mui/icons-material/TextFormat"
import FileCopyIcon from "@mui/icons-material/FileCopy"
import projectCreate from "../../../actions/project/projectCreate"
import projectDuplicate from "../../../actions/project/projectDuplicate"
import projectDelete from "../../../actions/project/projectDelete"
import projectRename from "../../../actions/project/projectRename"
import { setProject } from "../../../state/useProject"
import { setContextMenu } from "@pinyinma/context-menu"
import { setPreviewSafeMode } from "../../../state/usePreviewSafeMode"

const ProjectManager: React.FC<{ gradientSkip: number }> = ({ gradientSkip }) => {
    const [projects] = useProjects()

    return (
        <ManagerBase
         items={projects.filter(p => !p.lesson && !p.deleted)}
         gradientSkip={gradientSkip}
         onOpen={setProject}
         onContextMenu={p => setContextMenu([{
            text: "安全模式",
            onClick: () => (setPreviewSafeMode(true), setProject(p))
         }])}
         buttons={[
            {
                label: "新建",
                startIcon: <AddCircleIcon />,
                edit: "none",
                onClick: projectCreate
            },
            {
                label: "复制",
                startIcon: <FileCopyIcon />,
                edit: "one",
                onClick: items => projectDuplicate(items[0])
            },
            {
                label: "删除",
                startIcon: <DeleteIcon />,
                edit: "many",
                onClick: projectDelete
            },
            {
                label: "重命名",
                startIcon: <TextFormatIcon />,
                edit: "one",
                onClick: items => projectRename(items[0])
            }
        ]} />
    )
}

export default ProjectManager