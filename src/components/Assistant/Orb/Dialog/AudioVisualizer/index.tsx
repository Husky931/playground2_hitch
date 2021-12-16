import React, { useEffect, useState } from "react"
import { Cancellable } from "@lincode/promiselikes"
import { range } from "@lincode/utils"
import { useAssistantDialog } from "../../../../../state/useAssistantDialog"
import { useStopwatch } from "react-timer-hook"
import { getLessonEditor } from "../../../../../state/useLessonEditor"
import { nanoid } from "nanoid"

const fftSize = 128

const frameLoop = (cb: () => void) => {
    let loopId = -1
    const loop = () => {
        loopId = requestAnimationFrame(loop)
        cb()
    }
    loop()
    return new Cancellable(() => cancelAnimationFrame(loopId))
}

type AudioState = "wait" | "playing" | "stopped"

const AudioVisualizer: React.FC<{ onAudioState: (state: AudioState) => void }> = ({ onAudioState }) => {
    const [dialog] = useAssistantDialog()
    const [audioState, setAudioState] = useState<AudioState>("wait")
    const [frequencies, setFrequencies] = useState(() => range(fftSize / 2))

    const { seconds, minutes, start, pause, reset } = useStopwatch({ autoStart: false })
    
    useEffect(() => {
        onAudioState(audioState)
        audioState === "playing" ? start() : (reset(), pause())
    }, [audioState])

    useEffect(() => {
        if (!dialog.audio) {
            setAudioState("stopped")
            return
        }
        else setAudioState("wait")

        const audio = new Audio(dialog.audio + (getLessonEditor() ? `?version=${nanoid()}` : ""))
        audio.crossOrigin = "anonymous"
        audio.autoplay = true
        
        const context = new AudioContext()
        const source = context.createMediaElementSource(audio)

        const analyser = context.createAnalyser()
        analyser.fftSize = fftSize
        
        source.connect(analyser)
        analyser.connect(context.destination)

        const frequencies = new Uint8Array(analyser.frequencyBinCount)
    
        const handle = frameLoop(() => {
            analyser.getByteTimeDomainData(frequencies)
            setFrequencies([...frequencies])
        })

        audio.onplaying = () => {
            setAudioState("playing")
        }
        audio.onpause = () => {
            setAudioState("stopped")
            handle.cancel()
        }

        return () => {
            handle.cancel()
            audio.pause()
            context.close()
            source.disconnect()
            analyser.disconnect()
        }
    }, [dialog.audio])

    return audioState !== "playing" ? null : (
        <div className="w-full h-64 overflow-hidden flex items-center justify-center">
            {range(0, 360, 360 / frequencies.length || 1).map((angle, i) => (
                <div
                 key={angle}
                 className=" w-48 absolute"
                 style={{ transform: `rotate(${angle}deg) translateX(-50%)`, height: 1 }
                }>
                    <div className="center bg-white shadow-glow" style={{
                        width: Math.min((frequencies[i] - 127) * 2, 20),
                        height: 1
                    }} />
                </div>
            ))}
            <div className="text-center scale-75 leading-tight text-glow">
                <div className="text-xl">lingo</div>
                <div className="text-sm">assistant</div>
                <div className="text-xs mt-3">
                    {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </div>
            </div>
        </div>
    )
}

export default AudioVisualizer