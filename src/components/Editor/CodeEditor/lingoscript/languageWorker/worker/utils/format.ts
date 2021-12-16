export default (name: string, alias: string) => {
    let result = name
    const iMax = 20 - name.length
    for (let i = 0; i < iMax; i++) result += " "
    result += alias
    return result
}