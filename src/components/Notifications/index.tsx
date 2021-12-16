import * as React from "react"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import { Action, onNotification, Severity } from "../../events/onNotification"
import { useEffect } from "react"
import { Alert } from "@mui/material"

export interface SnackbarMessage {
	message: string
    severity: Severity
    action?: Action
}

export interface State {
	open: boolean
	snackPack: readonly SnackbarMessage[]
	messageInfo?: SnackbarMessage
}

const Notifications: React.FC = () => {
	const [snackPack, setSnackPack] = React.useState<Array<SnackbarMessage>>([])
	const [open, setOpen] = React.useState(false)
	const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(undefined)

	useEffect(() => {
		if (snackPack.length && !messageInfo) {
			setMessageInfo({ ...snackPack[0] })
			setSnackPack((prev) => prev.slice(1))
			setOpen(true)
		}
        else if (snackPack.length && messageInfo && open)
			setOpen(false)
            
	}, [snackPack, messageInfo, open])

    useEffect(() => {
        const handle = onNotification(([message, severity, action]) => {
            setSnackPack(prev => [...prev, { message, severity, action }])
            action?.complete.then(() => setOpen(false))
        })
        return () => {
            handle.cancel()
        }
    }, [])

	return (
        <Snackbar
         open={open}
         autoHideDuration={messageInfo?.action ? undefined : 2000}
         onClose={(_, reason) => reason !== "clickaway" && setOpen(false)}
         TransitionProps={{ onExited: () => setMessageInfo(undefined) }}
         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert severity={messageInfo?.severity} action={messageInfo?.action ? (
                <Button color="inherit" size="small" onClick={() => messageInfo.action?.complete.resolve()}>
                    {messageInfo.action.text}
                </Button>
            ) : null}>
                {messageInfo?.message}
            </Alert>
        </Snackbar>
	)
}

export default Notifications