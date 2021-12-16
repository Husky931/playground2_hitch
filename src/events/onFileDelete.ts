import { event } from "@lincode/events"

export const [emitFileDelete, onFileDelete] = event<string>()