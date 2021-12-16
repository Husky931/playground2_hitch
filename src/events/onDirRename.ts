import { event } from "@lincode/events"

export const [emitDirRename, onDirRename] = event<[string, string]>()