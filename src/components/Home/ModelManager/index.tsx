import React, { useEffect, useState } from "react"
import ManagerBase from "../utils/ManagerBase"
import DeleteIcon from "@mui/icons-material/Delete"
import TextFormatIcon from "@mui/icons-material/TextFormat"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import resourceCreate from "../../../actions/resource/resourceCreate"
import { IResource } from "@pinyinma/datatypes"
import resourceDelete from "../../../actions/resource/resourceDelete"
import { graphqlTypedMany } from "../../../utils/http"

const ModelManager: React.FC<{ gradientSkip: number }> = ({ gradientSkip }) => {
    const [items, setItems] = useState<Array<IResource>>([])
    const [refreshCount, setRefreshCount] = useState(0)

    useEffect(() => {
        (async () => {
            setItems(await graphqlTypedMany<IResource>(
                "query",
                    "resourceMany", {}, {
                        _id: true,
                        title: true,
                        type: true,
                        tags: true,
                        original: true,
                        version: true,
                        owner: true,
                        createdAt: true
                    }
                ))
        })()
    }, [refreshCount])

    return (
        <ManagerBase items={items} gradientSkip={gradientSkip} onOpen={item => console.log(item)} buttons={[
            {
                label: "上传",
                startIcon: <CloudUploadIcon />,
                edit: "none",
                onClick: () => resourceCreate().then(() => setRefreshCount(refreshCount + 1))
            },
            {
                label: "删除",
                startIcon: <DeleteIcon />,
                edit: "many",
                onClick: items => resourceDelete(items).then(() => setRefreshCount(refreshCount + 1))
            },
            {
                label: "重命名",
                startIcon: <TextFormatIcon />,
                edit: "one",
                onClick: items => {}
            },
        ]} />
    )
}

export default ModelManager