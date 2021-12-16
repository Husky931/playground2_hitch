import { event } from "@lincode/events"

export const [emitDirDelete, onDirDelete] = event<string>()