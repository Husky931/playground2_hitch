import React, { useRef, useState } from "react"
import TextInput from "../../../../TextInput"
import { validateUsername, validatePassword } from "@pinyinma/validators"
import StateButton from "@pinyinma/state-button"
import { setDialog } from "@pinyinma/dialog"
import { getAdmin } from "../../../../../state/useAdmin"
import queryUser from "../../../../../queries/queryUser"

const UsernameSignUp: React.FC = () => {
    const textfieldRef = useRef<HTMLDivElement>(null)

    const usernameRef = useRef("")
    const passwordRef = useRef("")
    const password2Ref = useRef("")

    const [usernameErr, setUsernameErr] = useState("")
    const [passwordErr, setPasswordErr] = useState("")
    const [password2Err, setPassword2Err] = useState("")

    const validate = () => {
        const usernameRes = validateUsername(usernameRef.current)
        const passwordRes = validatePassword(passwordRef.current)
        let password2Res = validatePassword(password2Ref.current)
        if (password2Res === "success")
            password2Res = password2Ref.current === passwordRef.current ? "success" : "内容和“密码”必须一致"

        let success = true

        if (usernameRes !== "success") {
            setUsernameErr(usernameRes)
            success = false
        }
        if (passwordRes !== "success") {
            setPasswordErr(passwordRes)
            success = false
        }
        if (password2Res !== "success") {
            setPassword2Err(password2Res)
            success = false
        }
        return success
    }

    const fetchData = async () => {
        if (!getAdmin()) {
            setDialog({ message: "请等待开课" })
            throw new Error("请等待开课")
        }
        try {
            await queryUser({ username: usernameRef.current, password: passwordRef.current }, "mutation", "userSignUp")
        }
        catch (err: any) {
            err.message.startsWith("E11000 ") && setUsernameErr("用户名已经存在")
            throw err
        }
    }

    return (
        <div>
            <TextInput label="新用户名" valueRef={usernameRef} err={usernameErr} setErr={setUsernameErr} />
            <TextInput label="新密码" password valueRef={passwordRef} err={passwordErr} setErr={setPasswordErr} />
            <TextInput
             label="确认密码"
             password
             valueRef={password2Ref}
             textfieldRef={textfieldRef}
             err={password2Err}
             setErr={setPassword2Err}
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

export default UsernameSignUp