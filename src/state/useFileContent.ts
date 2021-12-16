import makeUseFileRecord from "./utils/makeUseFileRecord"

export const [useFileContent, , getFileContent, assignFileContent] = makeUseFileRecord<Promise<string>>()