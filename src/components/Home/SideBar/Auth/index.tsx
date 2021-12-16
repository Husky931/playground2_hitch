import React, { useState } from "react"
import { Tabs, Tab } from "@mui/material"
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import { RASPBERRY } from "../../../../globals"
//@ts-ignore
import hitchLogo2 from '../../../../images/logoWhite.svg'

const Auth: React.FC = () => {
    const [index, setIndex] = useState(0)

    return (
        <div className="w-full px-6 mt-7" style={RASPBERRY ? undefined : { height: 465 }}>
            {!RASPBERRY && (
                <>
                    {
                        //@ts-ignore
                        VERSION === "hitch" && (
                          <div className='w-full h-20 mb-4'>
                            <img className="m-auto h-full"  src={hitchLogo2} />
                          </div>

                        )
                    }
                    <Tabs
                     value={index}
                     onChange={(_, i) => setIndex(i)}
                     className="mb-10"
                    >
                        <Tab label="登录" style={{ minWidth: "50%" }} />
                        <Tab label="注册" style={{ minWidth: "50%" }} />
                    </Tabs>
                </>
            )}
            {index === 0 ? <SignIn /> : <SignUp />}
        </div>
    )
}

export default Auth