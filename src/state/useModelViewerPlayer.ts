import store from "@lincode/reactivity"
import { Player } from "../utils/loadPlayer"

export const [setModelViewerPlayer, getModelViewerPlayer] = store<Player | undefined>(undefined)