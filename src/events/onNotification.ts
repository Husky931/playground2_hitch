import { event } from "@lincode/events"
import { Resolvable } from "@lincode/promiselikes"

export type Severity = "error" | "info" | "success" | "warning"
export type Action = { text: string, complete: Resolvable }

type Notification = [string, Severity, Action?]

const [emitNotification0, onNotification] = event<Notification>()
export { onNotification }

export const emitNotification = (val: Notification) => {
    document.visibilityState === "visible" && emitNotification0(val)
}

export const currentNotification = {
    action: undefined as Action | undefined,
    severity: "info" as Severity
}

const persistentNotifications: Array<Notification> = []

onNotification(notification => {
    const [, severity, action] = notification

    currentNotification.severity = severity
    currentNotification.action = action

    if (action) {
        persistentNotifications.push(notification)

        action.complete.then(()=> {
            persistentNotifications.pop()
            const prev = persistentNotifications.pop()
            prev && emitNotification(prev)
        })
    }
})