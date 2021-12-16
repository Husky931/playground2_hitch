import { useFileDrop } from "@lincode/hooks"
import { omitDeep } from "@lincode/utils"
import { getExtensionType } from "@pinyinma/validators"
import { nanoid } from "nanoid"
import { useFileBrowserDrag } from "../../../../state/useFileBrowserDrag"
import { userAddBaseNode } from "../../../../state/useGameEditorGraph"
import { getRelativeURI } from "../../../../utils/uriGetters"
import fetchGameFile from "../fetchGameFile"

export default () => {
    const [location] = useFileBrowserDrag()

    return useFileDrop(() => {
        if (!location) return
        
        const fileType = getExtensionType(location)

        if (fileType === "scene") {
            fetchGameFile(location).then(data => {
                if (!data) return
                
                try {
                    userAddBaseNode({ type: "group", uuid: nanoid(), children: omitDeep(JSON.parse(data), ["uuid"]) })
                }
                catch {}
            })

            // userAddBaseNode({ type: "scene", uuid: nanoid(), src: getRelativeURI(location) })
        }
        else if (fileType === "model")
            userAddBaseNode({ type: "model", uuid: nanoid(), src: getRelativeURI(location) })

    }, !location)
}