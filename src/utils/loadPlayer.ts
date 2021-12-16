import { Cancellable, Resolvable } from "@lincode/promiselikes"
import { getLegacy, Legacy } from "../state/useLegacy"
import { getProjectRootURI } from "./uriGetters"
import type * as player from "@pinyinma/player"
import ResizeObserver from "resize-observer-polyfill"
import { getTheme } from "@pinyinma/playground-theme"
import { getProject } from "../state/useProject"
import { baseURL } from "./http"

export type Player = typeof player

const legacyShim = (player: any, legacy: Legacy) => legacy === "0.0.1" && Object.assign(player, {
    gamelib: {
        setBackgroundColor: () => {},
        setOrbitControls: player.setOrbitMode,
        setSelection: () => {},
        getSelectionTarget: () => new Cancellable(),
        setContainerSize: ([w, h]: [number, number]) => player.setSize({ w, h }),
        getCameraList: () => new Cancellable(),
        getCamera: () => new Cancellable(),
        setCamera: () => {}
    },
    onReload: () => new Cancellable()
})

const getPlayer = (iframe: any, legacy: Legacy) => legacy === "0.0.1" ? iframe.contentWindow.$eWRhpRV$player : iframe.player

const getPlayerVersion = (legacy: Legacy) => {
    if (legacy === "latest")
        return "player"

    if (legacy === "1.0.0")
        return "legacyPlayer1"

    if (legacy === "0.0.1")
        return "legacyPlayer"

    throw new Error("unexpected platform version " + legacy)
}

type Options = {
    debugMode: boolean
    iframe: HTMLIFrameElement
    cleanup: Resolvable
    code?: string
    urlMap?: Record<string, string>
    onPrint?: (message: string) => void
    legacy?: Legacy
}

const dev = process.env.NODE_ENV === "development" ? "true" : "false"

export default async ({ debugMode, iframe, cleanup, code, urlMap, onPrint, legacy = getLegacy() }: Options) => {
    Object.assign(iframe, { debugMode, urlMap, onPrint })
    cleanup.then(() => Object.assign(iframe, { srcdoc: "", player: undefined }))

    iframe.style.visibility = "hidden"

    iframe.srcdoc = 
`<!DOCTYPE html>
<html lang="zh">
<head>
    <base href="${baseURL + getProjectRootURI() + "/"}" />
    <meta charset="utf-8">
    <meta content="ie=edge" http-equiv="x-ua-compatible">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>LingoPlayer</title>
</head>
<body>
    <script>
        const dispatchKeyboardEvent = e => {
            e.preventDefault()
            const event = new e.constructor(e.type, {
                metaKey: e.metaKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                key: e.key,
                bubbles: true
            }) 
            frameElement.dispatchEvent(event)
        }
        document.addEventListener("keydown", dispatchKeyboardEvent)
        document.addEventListener("keyup", dispatchKeyboardEvent)

        const dispatchDragEvent = e => {
            const event = new e.constructor(e.type, {
                dataTransfer: e.dataTransfer,
                bubbles: true
            }) 
            frameElement.dispatchEvent(event)
        }
        document.addEventListener("dragover", dispatchDragEvent)
        document.addEventListener("dragenter", dispatchDragEvent)
        document.addEventListener("dragleave", dispatchDragEvent)
        document.addEventListener("drop", dispatchDragEvent)

        const dispatchEvent = e => {
            const bounds = frameElement.getBoundingClientRect()
            const event = new e.constructor(e.type, {
                clientX: e.clientX + bounds.x,
                clientY: e.clientY + bounds.y,
                bubbles: true
            }) 
            frameElement.dispatchEvent(event)
        }
        document.addEventListener("mousedown", dispatchEvent)
        document.addEventListener("mouseup", dispatchEvent)
        document.addEventListener("click", dispatchEvent)
        document.addEventListener("contextmenu", e => {
            e.preventDefault()
        })
    </script>
    <script src="/${getPlayerVersion(legacy)}.js"></script>
    ${onPrint && legacy !== "0.0.1"
    ? `<script>
        const getCircularReplacer = () => {
            const seen = new WeakSet()
            return (_, value) => {
                if (typeof value === "object" && value) {
                    if (seen.has(value)) return
                    seen.add(value)
                }
                return value
            }
        }
        const consoleLog = console.log
    
        console.log = (...args) => {
            consoleLog(...args)
            const hasObject = args.some(val => typeof val === "object" && val)
            frameElement.onPrint(JSON.stringify(args, hasObject ? getCircularReplacer() : undefined).slice(1, -1))
        }
    </script>`
    : ""}
    ${legacy === "latest"
    ? `<script>
        GameRoom.projectId = "${getProject()?._id}"
        GameRoom.dev = ${dev}
        GameRoom.domain = "${location.hostname}"
    </script>`
    : ""}
    <script type="module">${code}</script>
</body>
</html>`

    await new Promise<void>(resolve => iframe.onload = () => {
        const interval = setInterval(() => {
            if (!getPlayer(iframe, legacy)) return
            clearInterval(interval)
            resolve()
        })
        cleanup.then(() => clearInterval(interval))
    })

    const player: Player = getPlayer(iframe, legacy)
    legacyShim(player, legacy)

    if (debugMode) {
        const resizeObserver = new ResizeObserver(() => {
            player.gamelib.setContainerSize([iframe.clientWidth, iframe.clientHeight])
        })
        resizeObserver.observe(iframe)
        cleanup.then(() => resizeObserver.disconnect())
    }
    player.gamelib.setBackgroundColor(getTheme().palette.background.default)
    iframe.style.visibility = "visible"
    
    return player
}