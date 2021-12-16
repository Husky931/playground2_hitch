import React, { useState } from "react"
import UsernameSignIn from "./UsernameSignIn"
import QRSignIn from "../QRSignIn"
import { RASPBERRY } from "../../../../../globals"
import ButtonTabs from "../../../../ButtonTabs"

const SignIn: React.FC = () => {
    const [method, setMethod] = useState<"username" | "qr">("username")
    
    return (
        <>
            {!RASPBERRY && (
                <ButtonTabs className="mb-10" labelColor="rgba(255,255,255,0.9)" tabs={{
                    "用户名": () => setMethod("username"),
                    "微信登录": () => setMethod("qr")
                }} />
            )}
            {method === "username" && <UsernameSignIn />}
            {method === "qr" && <QRSignIn />}
        </>
    )
}

export default SignIn