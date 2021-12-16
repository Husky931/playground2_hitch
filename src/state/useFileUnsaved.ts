import makeUseFileRecord from "./utils/makeUseFileRecord"

export const [useFileUnsaved, , getFileUnsaved, assignFileUnsaved, omitFileUnsaved] = makeUseFileRecord<boolean>()