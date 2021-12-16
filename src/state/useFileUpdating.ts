import makeUseFileRecord from "./utils/makeUseFileRecord"

export const [useFileUpdating, , , assignFileUpdating, omitFileUpdating] = makeUseFileRecord<boolean>()