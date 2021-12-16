export default (blob: Blob, fileName: string): File => {
    const b: any = blob
    b.lastModifiedDate = new Date()
    b.name = fileName
    b.__proto__ = File.prototype
    return b
}