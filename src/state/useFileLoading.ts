import makeUseFileRecord from "./utils/makeUseFileRecord"

export const [useFileLoading, , , assignFileLoading, omitFileLoading] = makeUseFileRecord<boolean>()