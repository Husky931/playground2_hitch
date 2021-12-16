import { useEffect, useState } from "react"

export default <T>(onChangeCommitted: () => void) => {
    const [committed, setCommitted] = useState<T | undefined>(undefined)

    useEffect(() => {
        committed !== undefined && onChangeCommitted()
    }, [committed])

    return setCommitted
}