import { event } from "@lincode/events"

export const [emitFileRename, onFileRename] = event<[string, string]>()