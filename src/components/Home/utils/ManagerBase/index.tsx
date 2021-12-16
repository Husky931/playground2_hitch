import { ILesson, IProject } from "@pinyinma/datatypes"
import React, { useEffect, useState } from "react"
import lessonContextMenu from "../../../../actions/lesson/lessonContextMenu"
import { RASPBERRY } from "../../../../globals"
import getGradient from "../../../../utils/getGradient"
import AnimLock from "../AnimLock"
import ManagerCard from "./ManagerCard"
import ManagerMenu, { ManagerMenuButton } from "./ManagerMenu"

const ManagerBase: React.FC<{
    items: Array<ILesson | IProject>
    gradientSkip?: number
    buttons?: Array<ManagerMenuButton>
    title?: string
    onOpen: (item: any) => void
    onContextMenu?: (item: any) => void
    getLocked?: (item: any) => boolean
    onUnlock?: (item: any) => void
    getDisabled?: (item: any) => void

}> = ({ items, gradientSkip = 0, buttons, title, onOpen, onContextMenu, getLocked, onUnlock, getDisabled, children }) => {

    const [edit, setEdit] = useState(false)
    const [checkedItems, setCheckedItems] = useState<Array<any>>([])

    useEffect(() => {
        !edit && setCheckedItems([])
    }, [edit])

    return (
        <div className="overflow-y-scroll">
            {buttons && !RASPBERRY && (
                <ManagerMenu edit={edit} setEdit={setEdit} checkedItems={checkedItems} buttons={buttons} />
            )}
            {!buttons && title && (
                <div className="text-xl p-12 text-center opacity-50 pb-0">{title}</div>
            )}
            <div className={`grid ${RASPBERRY ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"} lg:grid-cols-3 max-w-xl lg:max-w-4xl gap-6 p-10 mx-auto`}>
                {items.map((item, i) => (
                    <ManagerCard
                     key={i}
                     className={getGradient(i + gradientSkip) + (getDisabled?.(item) ? " opacity-25" : "")}
                     edit={edit}
                     onChecked={() => setCheckedItems([...checkedItems, item])}
                     onUnchecked={() => setCheckedItems(checkedItems.filter(p0 => p0 !== item))}
                     onOpen={() => onOpen(item)}
                     onContextMenu={() => onContextMenu?.(item)}
                     title={item.title}
                     date={item.createdAt}
                    >
                        {getLocked && (
                            <AnimLock
                             clickThrough={edit}
                             locked={getLocked(item)}
                             onClick={() => onUnlock?.(item)}
                             onContextMenu={() => lessonContextMenu(item, true)}
                            />
                        )}
                    </ManagerCard>
                ))}
            </div>
            {items.length ? undefined : (
                <div className="absfull flex justify-center items-center opacity-25 font-bold">
                    还没有建立项目
                </div>
            )}
            {children}
        </div>
    )
}
export default ManagerBase