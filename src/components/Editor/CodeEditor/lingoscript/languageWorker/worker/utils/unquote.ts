import { last } from "@lincode/utils"

export default (s: string) => {
    const first = s[0]

    if ((first === "'" || first === '"') && first === last(s))
        return s.slice(1, -1)

    return s
}