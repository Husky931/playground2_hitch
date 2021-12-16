import React from "react"
import { AppBar, Toolbar, Button } from "@mui/material"

export type ManagerMenuButton = {
    label: string
    startIcon: JSX.Element
    edit: "none" | "one" | "many"
    onClick: (checkedItems: Array<any>) => void
}

const ManagerMenu: React.FC<{
    edit: boolean,
    setEdit: (val: boolean) => void,
    checkedItems: Array<any>,
    buttons: Array<ManagerMenuButton>

}> = ({ edit, setEdit, checkedItems, buttons }) => {

    return (
        <AppBar position="sticky" elevation={0} color="transparent" className="p-4 overflow-visible">
            <Toolbar variant="dense" className="mx-auto w-10/12 rounded-lg shadow-xl backdrop-blur-xl bg-blue-900 bg-opacity-50 text-white text-opacity-75">
                {buttons.map(b => (
                    <Button
                     key={b.label}
                     className="mr-2"
                     color="inherit"
                     variant="outlined"
                     size="small"
                     startIcon={b.startIcon}
                     disabled={(
                         b.edit === "none"
                            ? edit
                            : b.edit === "one"
                                ? (!edit || checkedItems.length !== 1)
                                : (!edit || checkedItems.length === 0)
                     )}
                     onClick={() => {
                         b.onClick(checkedItems)
                         edit && setEdit(false)
                     }}
                    >
                       {b.label}
                   </Button>
                ))}

                <div className="flex-grow" />

                <Button
                 size="small"
                 color="inherit"
                 variant="outlined"
                 onClick={() => setEdit(!edit)}
                >
                    {!edit ? "编辑" : "完成"}
                </Button>
            </Toolbar>
        </AppBar>
    )
}

export default ManagerMenu