import { splitFileName } from "@lincode/utils"
import blobToFile from "./blobToFile"

export const normalizeFileNameString = (fileName: string, fallbackExtension: string) => {
    const [name, extension] = splitFileName(fileName)
    return name + "." + (extension ?? fallbackExtension)
}

export const normalizeFileName = (file: Blob, newName: string, fallbackExtension: string): File => {
    const [name, extension] = splitFileName(newName)
    if (file instanceof File) {
        Object.defineProperty(file, "name", { value: name + "." + (extension ?? splitFileName(file.name)[1]) })
        return file
    }
    return blobToFile(file, name + "." + (extension ?? fallbackExtension))
}