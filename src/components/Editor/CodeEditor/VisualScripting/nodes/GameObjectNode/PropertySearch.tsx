import { useCurrentRef } from "@lincode/hooks"
import { debounce } from "@lincode/utils"
import { Autocomplete, TextField } from "@mui/material"
import { validateSanitization } from "@pinyinma/validators"
import React, { useMemo, useState } from "react"
import stopPropagation from "../../../../../../utils/stopPropagation"

interface PropertySearchProps {
    label: string
    options: Array<string>
    optionsGroupBy?: (val: string) => string
    validator?: (val: string) => string
    validatorDebounce?: number
    onConfirm?: (val: string) => void
    className?: string
    style?: React.CSSProperties
}

const PropertySearch: React.FC<PropertySearchProps> = ({
    label, options, optionsGroupBy, validator, validatorDebounce, onConfirm, className, style
}) => {
    const [inputError, setInputError] = useState("")
    const [key, setKey] = useState(0)
    const keyRef = useCurrentRef(key)

    const debounceTime = validatorDebounce ?? 100
    const validatorDebounced = useMemo(() => (
        debounce(validator ?? validateSanitization, debounceTime, "trailingPromise")
    ), [validator])

    const validateInput = async (val: string, confirm: boolean) => {
        setInputError("")

        if (!val) return

        const keyCopy = keyRef.current
        const result = !confirm ? await validatorDebounced(val) : (validator ?? validateSanitization)(val)
        if (keyRef.current !== keyCopy) return
        
        const failed = result !== "success"

        if (failed)
            setInputError(result)
        else if (confirm) {
            setKey(key + 1)
            setInputError("")
            onConfirm?.(val.trim())
        }
    }

    return (
        <Autocomplete
         key={key}
         className={className}
         style={style}
         options={options}
         onChange={(_, val) => validateInput(val ?? "", true)}
         onInputChange={(_, val) => validateInput(val, false)}
         groupBy={optionsGroupBy}
         freeSolo={!!validator}
         autoHighlight
         fullWidth
         size="small"
         renderInput={params => (
            <TextField
             {...params}
             label={label}
             error={!!inputError}
             onMouseDown={stopPropagation}
            />
         )}
        />
    )
}

export default PropertySearch