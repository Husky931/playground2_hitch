import { ILesson, IProject, IResource } from "@pinyinma/datatypes"
import { setDialog } from "@pinyinma/dialog"

export default (
    items: Array<IProject | ILesson | IResource>,
    action: string,
    onConfirm: (name: string) => void | Promise<void> | undefined
) => {
    setDialog({
        message: `确定要${action}“${items.length > 1 ? `${items.length}个项目` : items[0].title}”吗？`,
        onConfirm
    })
}