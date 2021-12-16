import store from "@lincode/react-global-state"
import { ILesson } from "@pinyinma/datatypes"

export const [useLessonEditor, setLessonEditor, getLessonEditor] = store<ILesson | undefined>(undefined)