import makeUseFileRecord from "./utils/makeUseFileRecord"

export type CodeError = { message: string, token: { line: number } }

export const [useCodeErrors, setCodeErrors, getCodeErrors] = makeUseFileRecord<Array<CodeError>>()