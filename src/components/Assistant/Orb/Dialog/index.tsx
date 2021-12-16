import { Container } from "@mui/material"
import React, { useEffect, useMemo } from "react"
import { animated, SpringValue } from "react-spring"
import { getAssistantDialog, setAssistantDialog, useAssistantDialog } from "../../../../state/useAssistantDialog"
import { setAssistantGraphId } from "../../../../state/useAssistantGraphId"
import { setAssistantOpen } from "../../../../state/useAssistantOpen"
import DialogButton from "./DialogButton"
import DialogToolbar from "./DialogToolbar"
import AudioVisualizer from "./AudioVisualizer"
import { between, valueof } from "@lincode/utils"
import assistantStates from "../../../../state/utils/assistantStates"
import { Cancellable } from "@lincode/promiselikes"
import Markdown from "../../../Markdown"
import { useAssistantAudioState } from "../../../../state/useAssistantAudioState"
import { getCodeErrors } from "../../../../state/useCodeErrors"
import { setAssistantHighlight } from "../../../../state/useAssistantHighlight"
import { setAssistantColor } from "../../../../state/useAssistantColor"
import { getCodeTyping } from "../../../../state/useCodeTyping"

let errorBlocked = false

const nextStep = async (nextId: string | undefined) => {
    if (errorBlocked) return

    await new Promise<void>(resolve => getCodeTyping((typing, handle) => {
        if (typing) return
        handle.cancel()
        resolve()
    }))
    if (Object.keys(getCodeErrors()).length) {
        errorBlocked = true
        
        let code = between(getAssistantDialog().message, "```", "```")
        code && (code = "\n```" + code  + "```")

        setAssistantDialog({
            message: "代码还有错误，请修正后继续" + code,
            choices: [{
                label: "继续",
                onClick: () => {
                    if (Object.keys(getCodeErrors()).length) return
                    errorBlocked = false
                    
                    setAssistantColor("primary")
                    nextId ? setAssistantGraphId(nextId) : setAssistantOpen(false)
                }
            }]
        })
        setAssistantHighlight({ selector: ".lingo-monaco", clickable: true })
        setAssistantColor("secondary")
        return
    }
    nextId ? setAssistantGraphId(nextId) : setAssistantOpen(false)
}

const Dialog: React.FC<{
    width: number,
    opacity: SpringValue<number>,
    observeResize: (el: HTMLElement | null) => void

}> = ({ width, opacity, observeResize }) => {

    const [{ message, choices }] = useAssistantDialog()
    const [audioState, setAudioState] = useAssistantAudioState()

    const [awaitStateChoices, filteredChoices] = useMemo(() => {
        const awaitStateChoices: Array<valueof<typeof choices>> = []

        const filteredChoices = audioState !== "stopped" ? [] : choices.filter(choice => {
            if (choice.label.startsWith("[[") && choice.label.endsWith("]]")) {
                awaitStateChoices.push(choice)
                return false
            }
            return true
        })
        return [awaitStateChoices, filteredChoices] as const

    }, [audioState, choices])

    useEffect(() => {
        if (!awaitStateChoices.length) return

        let handle: Cancellable | undefined

        for (const { label, nextId } of awaitStateChoices)
            for (const part of label.slice(2, -2).split("&&"))
                if (part.includes("==")) {
                    const [state, value] = part.split("==")
                    handle = assistantStates[state]?.((v, handle) => {
                        try {
                            if (v !== JSON.parse(value)) return
                            handle.cancel()
                            nextStep(nextId)
                        }
                        catch {}
                    })
                }
                else if (part.includes("!=")) {
                    const [state, value] = part.split("!=")
                    handle = assistantStates[state]?.((v, handle) => {
                        try {
                            if (v === JSON.parse(value)) return
                            handle.cancel()
                            nextStep(nextId)
                        }
                        catch {}
                    })
                }
        return () => {
            handle?.cancel()
        }
    }, [awaitStateChoices])

    return (
        <animated.div
         style={{ width, opacity, display: opacity.to(v => v > 0 ? "block" : "none") }}
         ref={observeResize}
        >
            <DialogToolbar />
            <AudioVisualizer onAudioState={state => setAudioState(state)} />
            {audioState === "stopped" ? (
                <Container className="py-6">
                    <Markdown>{message}</Markdown>
                    {filteredChoices.map(({ label, nextId, onClick }) => (
                        <DialogButton key={label} onClick={() => (nextStep(nextId), onClick?.())}>
                            {label}
                        </DialogButton>
                    ))}
                </Container>
            ) : audioState === "wait" ? (
                <div></div>
            ) : null}
        </animated.div>
    )
}

export default Dialog