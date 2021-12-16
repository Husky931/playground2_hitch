import { IconButton } from "@mui/material"
import { RemoveCircleOutline } from "@mui/icons-material"
import { Connection, Handle, Position } from "react-flow-renderer"
import React from "react"
import stopPropagation from "../../../../../utils/stopPropagation"
import { setDialog } from "@pinyinma/dialog"

interface PropertyHandleBaseProps {
    label: string
    isTarget?: boolean
    onRemove?: () => void
    onConnect?: (connection: Connection) => void
    onChangeCommitted: () => void
}

export interface PropertyHandleProps<T> extends PropertyHandleBaseProps {
    value: T
    onChange: (value: T) => void
}

const BasePropertyHandle: React.FC<PropertyHandleBaseProps> = ({
    label, isTarget, onRemove, onConnect, onChangeCommitted, children
}) => {
    const handleRemove = onRemove && (() => setDialog({
        message: `确定要删除属性“${label}”吗？`,
        onConfirm: () => {
            onRemove()
            onChangeCommitted()
        }
    }))

    return (
        <div className={"flex justify-end items-center px-2" + (isTarget ? " flex-row-reverse" : "")}>
            <div className="flex items-center w-full">
                {handleRemove && (
                    <IconButton size="small" disableRipple onMouseDown={stopPropagation} onClick={handleRemove}>
                        <RemoveCircleOutline fontSize="small" />
                    </IconButton>
                )}
                <div>{label}</div>
                <div className="flex-grow" />
                {children}
            </div>
            <Handle
             type={isTarget ? "target" : "source"}
             position={isTarget ? Position.Left : Position.Right} id={label}
             onConnect={onConnect}
            />
        </div>
    )
}

export default BasePropertyHandle