import React, { useState, MutableRefObject, useEffect, RefObject } from "react"
import { TextField } from "@mui/material"

const TextInput: React.FC<{
    className?: string,
    label?: string,
    valueRef?: MutableRefObject<string>,
    textfieldRef?: RefObject<HTMLDivElement>
    err?: string,
    setErr?: (val: string) => void,
    password?: boolean

}> = ({ className, label, valueRef, textfieldRef, err, setErr, password }) => {

    const [error, setError] = useState(false)
    const [helperText, setHelperText] = useState(" ")

    useEffect(() => {
        setError(!!err)
        setHelperText(err || " ")
    }, [err])

    return (
        <TextField
         ref={textfieldRef}
         className={className + " mb-4"}
         label={label}
         fullWidth
         onChange={e => (setErr?.(""), valueRef && (valueRef.current = e.target.value))}
         error={error}
         helperText={helperText}
         type={password ? "password" : "email"}
         autoComplete={password ? "new-password" : undefined}
        />
    )
}

export default TextInput