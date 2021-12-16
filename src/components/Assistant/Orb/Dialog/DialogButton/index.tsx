import React from "react"

const DialogButton: React.FC<{
    onClick?: () => void, highlighted?: boolean

}> = ({ children, onClick }) => {

    return (
        <button
         className="w-full mt-4 p-2 rounded-md border border-white border-opacity-50"
         onClick={onClick}
        >
            {children}
        </button>
    )
}

export default DialogButton