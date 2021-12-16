import { useEffect, useState } from "react"
import { Mp3MediaRecorder } from "mp3-mediarecorder"
import { event } from "@lincode/events"

const worker = new Worker(new URL("./worker", import.meta.url))

const useAudioRecorder = (onRecorded?: (blob: Blob) => string | Promise<string | void> | void) => {
	const [src, setSrc] = useState("")
	const [recording, setRecording] = useState(false)

	useEffect(() => {
		if (!recording) return

		const [emitStop, onStop] = event()

		navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
			const recorder = new Mp3MediaRecorder(stream, { worker })
			recorder.ondataavailable = async (e: any) => {
				recorder.ondataavailable = null
				setSrc(await onRecorded?.(e.data) || (() => {
					const objectURL = URL.createObjectURL(e.data)
					onStop(() => URL.revokeObjectURL(objectURL))
					return objectURL
				})())
			}
			recorder.start()
			onStop(() => recorder.stop())
		})

		return () => {
			emitStop(undefined, true)
		}
	}, [recording])

	const start = () => setRecording(true)
	const stop = () => setRecording(false)

	return <const>[start, stop, recording, src, setSrc]
}

export default useAudioRecorder
