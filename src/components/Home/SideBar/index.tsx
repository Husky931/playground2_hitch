import { useTheme } from "@pinyinma/playground-theme"
import React from "react"
import { HOME_SIDEBAR_WIDTH } from "../../../globals"
import { useUser } from "../../../state/useUser"
import Auth from "./Auth"
import Profile from "./Profile"

const SideBar: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
    const [user] = useUser()
    const [theme] = useTheme()

    return (
        <div className="rounded-2xl backdrop-blur-xl shadow-xl" style={{
            ...style,
            background: "rgba(255,255,255,0.04)",
            width: HOME_SIDEBAR_WIDTH
        }}>
            {!CSS.supports("backdrop-filter: blur(20px)") && !CSS.supports("-webkit-backdrop-filter: blur(20px)") && (
                <div className="absfull" style={{
                    background: theme.customPalette.background.lighter0,
                    opacity: 0.9
                }} />
            )}
            <div className="absfull opacity-75">
                {user ? <Profile /> : <Auth />}
            </div>
        </div>
    )
}

export default SideBar