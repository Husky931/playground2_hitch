import React, { useMemo } from "react"
import colorToHex from "../../../../../utils/colorToHex"
import stopPropagation from "../../../../../utils/stopPropagation"
import StringPropertyHandle, { StringPropertyHandleProps } from "./StringPropertyHandle"

interface ColorPropertyHandleProps extends StringPropertyHandleProps {}

const ColorPropertyHandle: React.FC<ColorPropertyHandleProps> = ({ value, onChange, onChangeCommitted, ...restProps }) => {
    const hex = useMemo(() => colorToHex(value), [value])
    
    return (
        <StringPropertyHandle {...restProps} value={value} onChange={onChange} onChangeCommitted={onChangeCommitted}>
            <input
             type="color"
             className="w-4 h-5 bg-black bg-opacity-25 mr-2"
             value={hex}
             onChange={e => onChange(e.currentTarget.value)}
             onMouseDown={stopPropagation}
             onBlur={onChangeCommitted}
            />
        </StringPropertyHandle>
    )
}

export default ColorPropertyHandle