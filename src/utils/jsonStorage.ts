import { tryParse } from "@lincode/utils"

export const set = <T extends Record<string, any>>(key: string, value?: T) => {
    localStorage.setItem(key, JSON.stringify(value))
}

export const get = <T extends Record<string, any>>(key: string): T | undefined => {
    return tryParse(localStorage.getItem(key))
}

export const del = (key: string) => {
    localStorage.removeItem(key)
}