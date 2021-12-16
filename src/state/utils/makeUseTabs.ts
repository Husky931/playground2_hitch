import autoResetStore from "./autoResetStore"
import { push, pull, rename, renameStartsWith, filter } from "@lincode/react-global-state"
import { onFileRename } from "../../events/onFileRename"
import { onDirRename } from "../../events/onDirRename"
import { onFileDelete } from "../../events/onFileDelete"
import { onDirDelete } from "../../events/onDirDelete"
import { extendFunction } from "@lincode/utils"

export default (onPullTabs?: (tab: string) => void) => {
    const [useTab, setTab, getTab] = autoResetStore<string | undefined>(undefined)
    
    const [useTabs, setTabs, getTabs] = autoResetStore<Array<string>>([])

    let index = -1

    const changeTab = () => {
        const tabs = getTabs()

        for (let i = index; i >= 0; --i) {
            const tab = tabs[i]
            if (tab) {
                setTab(tab)
                return
            }
        }
        setTab(undefined)
    }

    const renameTab = (from: string, to: string) => getTab() === from && setTab(to)
    const renameStartsWithTab = (from: string, to: string) => {
        const tab = getTab()
        tab?.startsWith(from) && setTab(tab.replace(from, to))
    }

    const pullTabs = extendFunction(pull(setTabs, getTabs), tab => {
        changeTab()
        onPullTabs?.(tab)
    })
    const pushTabs = push(setTabs, getTabs)
    const renameTabs = extendFunction(rename(setTabs, getTabs), renameTab)
    const renameStartsWithTabs = extendFunction(renameStartsWith(setTabs, getTabs), renameStartsWithTab)
    const filterTabs = extendFunction(filter(setTabs, getTabs), changeTab)

    getTab(tab => {
        tab && !getTabs().includes(tab) && pushTabs(tab)
        index = tab ? getTabs().indexOf(tab) : -1
    })

    onFileDelete(location => pullTabs(location))
    onFileRename(([from, to]) => renameTabs(from, to))
    onDirDelete(location => filterTabs(f => !f.startsWith(location)))
    onDirRename(([from, to]) => renameStartsWithTabs(from, to))

    return <const>[useTab, setTab, getTab, useTabs, pullTabs]
}