export default <T>(validator: (obj: unknown) => obj is T): (obj: unknown) => obj is T | undefined => {
    //@ts-ignore
    return (obj: unknown) => obj === undefined ? true : validator(obj)
}