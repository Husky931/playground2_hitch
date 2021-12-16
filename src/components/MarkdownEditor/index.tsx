import { useTruthy } from "@lincode/hooks"
import React, { useEffect } from "react"
import { useMarkdownEditor } from "../../state/useMarkdownEditor"
import UISuspense from "@pinyinma/ui-suspense"
import ModalDialog from "@pinyinma/modal-dialog"

const MarkdownEditor = React.lazy(() => import("./MarkdownEditor"))

const MarkdownEditorDialog = () => {
    const [markdownEditor, setMarkdownEditor] = useMarkdownEditor()
	const markdownEditorTruthy = useTruthy(markdownEditor)
	const [value, setValue] = React.useState("")

	useEffect(() => {
		setValue(markdownEditor?.markdown ?? "")
	}, [markdownEditor])

    return (
        <ModalDialog
		 open={!!markdownEditor}
		 onClose={() => setMarkdownEditor(undefined)}
		 fullScreen={markdownEditorTruthy?.fullscreen}
		>
			<div style={{ width: 500, height: 300 }}>
				<UISuspense>
					<MarkdownEditor value={value} setValue={setValue} />
				</UISuspense>
			</div>
        </ModalDialog>
    )
}

export default MarkdownEditorDialog