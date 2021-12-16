import React, { useRef, useState } from "react"
import TextInput from "../../../../TextInput"
import { validateUsername, validatePassword } from "@pinyinma/validators"
import StateButton from "@pinyinma/state-button"
import queryUser from "../../../../../queries/queryUser"

const UsernameSignIn: React.FC = () => {
    const textfieldRef = useRef<HTMLDivElement>(null)
    
    const usernameRef = useRef("")
    const passwordRef = useRef("")

    const [usernameErr, setUsernameErr] = useState("")
    const [passwordErr, setPasswordErr] = useState("")

    const validate = () => {
        const usernameRes = validateUsername(usernameRef.current)
        const passwordRes = validatePassword(passwordRef.current)

        let success = true

        if (usernameRes !== "success") {
            setUsernameErr(usernameRes)
            success = false
        }
        if (passwordRes !== "success") {
            setPasswordErr(passwordRes)
            success = false
        }
        return success
    }

    const fetchData = async () => {
        try {
            await queryUser({ username: usernameRef.current, password: passwordRef.current }, "query", "userSignIn")
        }
        catch (err: any) {
            if (err.message.startsWith("password "))
                setPasswordErr("密码错误")
            else if (err.message.startsWith("username"))
                setUsernameErr("用户名不存在")

            throw err
        }
    }

    return (
        <div>
            <TextInput label="用户名" valueRef={usernameRef} err={usernameErr} setErr={setUsernameErr} />
            <TextInput
             label="密码"
             password
             valueRef={passwordRef}
             textfieldRef={textfieldRef}
             err={passwordErr}
             setErr={setPasswordErr}
            />
            <StateButton
             validate={validate}
             fetchData={fetchData}
             className="mt-6"
             fullWidth
             textfieldRef={textfieldRef}
            >
                点击进入
            </StateButton>
        </div>
    )
}

export default UsernameSignIn