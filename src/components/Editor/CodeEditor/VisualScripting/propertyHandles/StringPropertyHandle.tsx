import React from "react"
import stopPropagation from "../../../../../utils/stopPropagation"
import BasePropertyHandle, { PropertyHandleProps } from "./BasePropertyHandle"
import useCommit from "./useCommit"

export interface StringPropertyHandleProps extends PropertyHandleProps<string> {}

const StringPropertyHandle: React.FC<StringPropertyHandleProps> = ({
    value, onChange, onChangeCommitted, children, ...restProps
}) => {
    const setCommitted = useCommit(onChangeCommitted)

    return (
        <BasePropertyHandle {...restProps} onChangeCommitted={onChangeCommitted}>
            {children}
            <input
             className="bg-black bg-opacity-25 border border-white border-opacity-25 w-20"
             value={value}
             onChange={e => onChange(e.currentTarget.value)}
             onMouseDown={stopPropagation}
             onBlur={(e) => setCommitted(e.currentTarget.value)}
             onKeyDown={e => e.key === "Enter" && setCommitted(e.currentTarget.value)}
            />
        </BasePropertyHandle>
    )
}

export default StringPropertyHandle