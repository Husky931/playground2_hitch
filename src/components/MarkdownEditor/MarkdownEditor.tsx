import { AppBar, Button, Toolbar } from "@mui/material"
import * as React from "react"
import ReactMde from "react-mde"
import "react-mde/lib/styles/css/react-mde-all.css"
import CancelIcon from "@mui/icons-material/Cancel"
import SaveIcon from "@mui/icons-material/Save"
import { useMarkdownEditor } from "../../state/useMarkdownEditor"
import { useTruthy } from "@lincode/hooks"
import Markdown from "../Markdown"

const MarkDownEditor: React.FC<{ value: string, setValue: (val: string) => void }> = ({ value, setValue }) => {
	const [markdownEditor, setMarkdownEditor] = useMarkdownEditor()
	const markdownEditorTruthy = useTruthy(markdownEditor)

	const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write")

	return (
		<div className="absfull flex flex-col">
			<AppBar position="relative" color="transparent" elevation={0}>
				<Toolbar variant="dense">
					<Button
					 className="mr-2"
					 variant="contained"
					 color="secondary"
					 size="small"
					 startIcon={<CancelIcon />}
					 onClick={() => setMarkdownEditor(undefined)}
					>
						关闭
					</Button>
					<Button
					 className="mr-2"
					 variant="contained"
					 color="secondary"
					 size="small"
					 startIcon={<SaveIcon />}
					 onClick={async () => {
						await markdownEditorTruthy?.onConfirm?.(value)
						setMarkdownEditor(undefined)
					 }}
					>
						保存
					</Button>
				</Toolbar>
			</AppBar>
			<div className="text-black bg-white nofix flex-grow">
				<ReactMde
				 value={value}
				 onChange={setValue}
				 selectedTab={selectedTab}
				 onTabChange={setSelectedTab}
				 generateMarkdownPreview={markdown => Promise.resolve(<Markdown>{markdown}</Markdown>)}
				/>
			</div>
		</div>
	)
}

export default MarkDownEditor