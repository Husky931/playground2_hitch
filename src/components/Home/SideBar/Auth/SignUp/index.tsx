import React, { useState } from "react"
import QRSignIn from "../QRSignIn"
import UsernameSignUp from "./UsernameSignUp"
import ButtonTabs from "../../../../ButtonTabs"

const SignUp: React.FC = () => {
    const [method, setMethod] = useState<"username" | "qr">("username")

    return (
        <>
            <ButtonTabs className="mb-10" labelColor="rgba(255,255,255,0.9)" tabs={{
                "用户名注册": () => setMethod("username"),
                "微信一键注册": () => setMethod("qr")
            }} />
            {method === "qr" && <QRSignIn />}
            {method === "username" && <UsernameSignUp />}
        </>
    )
}

export default SignUp