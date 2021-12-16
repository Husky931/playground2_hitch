import React, { useEffect, useMemo, useState } from "react"
import BasePropertyHandle, { PropertyHandleProps } from "./BasePropertyHandle"
import stopPropagation from "../../../../../utils/stopPropagation"
import useCommit from "./useCommit"

interface NumberPropertyHandleProps extends PropertyHandleProps<number> {}

const NumberPropertyHandle: React.FC<NumberPropertyHandleProps> = ({ value, onChange, onChangeCommitted, ...restProps }) => {
    const [val, setVal] = useState(value.toString())
    const numberVal = useMemo(() => Number.isNaN(Number(val)) ? value : Number(val), [val, value])
    const setCommitted = useCommit(onChangeCommitted)

    useEffect(() => {
        setVal(value.toString())
    }, [value])

    useEffect(() => {
        onChange(numberVal)
    }, [numberVal])

    return (
        <BasePropertyHandle {...restProps} onChangeCommitted={onChangeCommitted}>
            <input
             type="number"
             className="bg-black bg-opacity-25 border border-white border-opacity-25 w-20"
             value={val}
             onChange={e => setVal(e.currentTarget.value)}
             onMouseDown={stopPropagation}
             onBlur={() => setCommitted(numberVal)}
             onKeyDown={e => e.key === "Enter" && setCommitted(numberVal)}
            />
        </BasePropertyHandle>
    )
}

export default NumberPropertyHandle