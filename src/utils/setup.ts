import "./preventers"
import userForceSignOut from "../actions/user/userForceSignOut"
import { decreaseLoadingCount, increaseLoadingCount } from "../state/useLoadingCount"
import { getUser } from "../state/useUser"
import { emitNotification } from "../events/onNotification"
import { Client } from "colyseus.js"
import { setQrSignInScanned } from "../state/useQrSignInScanned"
import { setClientId } from "../state/useClientId"
import { messages } from "@pinyinma/state-button"
import { baseWSURL, initGraphQL } from "./http"

messages.error = "出错啦"
messages.success = "成功"

initGraphQL({
    decreaseLoadingCount,
    increaseLoadingCount,
    getUser,
    userForceSignOut
})

const client = new Client(baseWSURL)

;(async () => {
    const room = await client.joinOrCreate<any>("client")

    room.onMessage("clientId", id => {
        setClientId(id)
        emitNotification(["网络连接建立", "success" ])
    })
    room.onMessage("clientScanned", () => setQrSignInScanned(true))
    window.addEventListener("offline", () => emitNotification(["网络连接断开", "error"]))
})()