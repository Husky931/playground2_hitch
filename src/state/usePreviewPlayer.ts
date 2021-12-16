import store from "@lincode/react-global-state"
import { Player } from "../utils/loadPlayer"

export const [usePreviewPlayer, setPreviewPlayer, getPreviewPlayer] = store<Player | undefined>(undefined)