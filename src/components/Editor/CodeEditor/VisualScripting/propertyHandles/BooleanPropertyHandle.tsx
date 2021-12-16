import React from "react"
import { Switch } from "@mui/material"
import BasePropertyHandle, { PropertyHandleProps } from "./BasePropertyHandle"
import stopPropagation from "../../../../../utils/stopPropagation"

interface BooleanPropertyHandleProps extends PropertyHandleProps<boolean> {}

const BooleanPropertyHandle: React.FC<BooleanPropertyHandleProps> = ({ value, onChange, onChangeCommitted, ...restProps }) => {
    return (
        <BasePropertyHandle {...restProps} onChangeCommitted={onChangeCommitted}>
            <Switch
             checked={value}
             onChange={(_, checked) => {
                 onChange(checked)
                 onChangeCommitted()
             }}
             onMouseDown={stopPropagation}
            />
        </BasePropertyHandle>
    )
}

export default BooleanPropertyHandle