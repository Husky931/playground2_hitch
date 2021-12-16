import * as React from "react"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import useMediaQuery from "@mui/material/useMediaQuery"
import ListSubheader from "@mui/material/ListSubheader"
import { useTheme } from "@mui/material/styles"
import { VariableSizeList, ListChildComponentProps } from "react-window"
import Typography from "@mui/material/Typography"
import { useCommandBoxOptions } from "../../state/useCommandBoxOptions"
import { getAbsoluteURI, getRelativeURI } from "../../utils/uriGetters"
import { emitCommandBoxConfirm } from "../../events/onCommandBoxConfirm"
import { setCommandBox } from "../../state/useCommandBox"

const LISTBOX_PADDING = 8

const renderRow = (props: ListChildComponentProps) => {
	const { data, index, style } = props
	const dataSet = data[index]
	const inlineStyle = {
		...style,
		top: (style.top as number) + LISTBOX_PADDING,
	}

	if (dataSet.hasOwnProperty("group"))
		return (
			<ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
				{dataSet.group}
			</ListSubheader>
		)

	return (
		<Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
			{dataSet[1]}
		</Typography>
	)
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
	const outerProps = React.useContext(OuterElementContext)
	return <div ref={ref} {...props} {...outerProps} />
})

const useResetCache = (data: any) => {
	const ref = React.useRef<VariableSizeList>(null)
	React.useEffect(() => {
		if (ref.current != null)
			ref.current.resetAfterIndex(0, true)
	}, [data])
	return ref
}

const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
	const { children, ...other } = props
	const itemData: React.ReactChild[] = []
	for (const item of children as any) {
		itemData.push(item)
		itemData.push(...(item.children || []))
	}

	const theme = useTheme()
	const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true })
	const itemCount = itemData.length
	const itemSize = smUp ? 36 : 48

	const getChildSize = (child: React.ReactChild) => {
		if (child.hasOwnProperty("group"))
			return 48

		return itemSize
	}

	const getHeight = () => {
		if (itemCount > 8)
			return 8 * itemSize

		return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
	}

	const gridRef = useResetCache(itemCount)

	return (
		<div ref={ref}>
			<OuterElementContext.Provider value={other}>
				<VariableSizeList
				 itemData={itemData}
				 height={getHeight() + 2 * LISTBOX_PADDING}
				 width="100%"
				 ref={gridRef}
				 outerElementType={OuterElementType}
				 innerElementType="ul"
				 itemSize={(index) => getChildSize(itemData[index])}
				 overscanCount={5}
				 itemCount={itemCount}
				>
					{renderRow}
				</VariableSizeList>
			</OuterElementContext.Provider>
		</div>
	)
})

const CommandSearch: React.FC = () => {
	const [options] = useCommandBoxOptions()

	return (
		<Autocomplete
		 sx={{ width: 300 }}
		 disableListWrap
		 ListboxComponent={ListboxComponent}
		 options={Object.keys(options).filter(f => f.includes(".")).map(getRelativeURI)}
		//  groupBy={(option) => option[0].toUpperCase()}
		//  renderGroup={params => params}
		 renderInput={params => <TextField {...params} autoFocus label="搜索文件名称" />}
		 renderOption={(props, option) => [props, option]}
		 autoHighlight
		 onChange={(_, val) => val && (emitCommandBoxConfirm(getAbsoluteURI(val)), setCommandBox(false))}
		 onBlur={() => setCommandBox(false)}
		 onKeyDown={e => e.key === "Escape" && setCommandBox(false)}
		/>
	)
}
export default CommandSearch