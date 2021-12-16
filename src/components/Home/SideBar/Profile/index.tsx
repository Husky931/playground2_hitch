import React from "react"
import { useUser } from "../../../../state/useUser"
import { Button } from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings"
import WorkIcon from "@mui/icons-material/Work"
import SchoolIcon from "@mui/icons-material/School"
import CloudIcon from "@mui/icons-material/Cloud"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import ImageIcon from "@mui/icons-material/Image"
import { setHome } from "../../../../state/useHome"
import userSignOut from "../../../../actions/user/userSignOut"
import userUpdate from "../../../../actions/user/userUpdate"
import { useAdmin } from "../../../../state/useAdmin"
import { useLessonsSorted } from "../../../../state/useLessons"
import { Avatar } from "@mui/material"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

const Profile: React.FC = () => {
    const [user] = useUser()
    const [admin] = useAdmin()
    const lessons = useLessonsSorted(false, () => admin, [admin])

    return (
        <>
            <Avatar className="w-20 h-20 mx-auto shadow-xl mb-2 -mt-6">
                <AccountCircleIcon className="w-full h-full" />
            </Avatar>
            <div className="w-full text-center text-lg">
                {user?.name ?? user?.username}
            </div>
            <div className="menuList p-6 mt-24">
                <div>
                    <Button color="inherit" size="small" onClick={() => setHome("lessons")}>
                        <SchoolIcon className="mr-4" />
                        课堂项目
                    </Button>
                </div>
                {(admin || !!lessons.length) && (
                    <div>
                        <Button color="inherit" size="small" onClick={() => setHome("webLessons")}>
                            <CloudIcon className="mr-4" />
                            在线课程
                        </Button>
                    </div>
                )}
                <div>
                    <Button color="inherit" size="small" onClick={() => setHome("projectManager")}>
                        <WorkIcon className="mr-4" />
                        我的项目
                    </Button>
                </div>
                {admin && (<>
                    <div>
                        <Button color="inherit" size="small" onClick={() => setHome("lessonManager")}>
                            <AccountTreeIcon className="mr-4" />
                            管理课程
                        </Button>
                    </div>
                    <div>
                        <Button color="inherit" size="small" onClick={() => setHome("modelManager")}>
                            <ImageIcon className="mr-4" />
                            管理模型
                        </Button>
                    </div>
                </>)}
            </div>
            <div className="menuList absolute bottom-0 p-6">
                <div>
                    <Button color="inherit" size="small" onClick={userUpdate}>
                        <SettingsIcon className="mr-4" />
                        更改账户信息
                    </Button>
                </div>
                <div>
                    <Button color="inherit" size="small" onClick={userSignOut}>
                        <AccountCircleIcon className="mr-4" />
                        退出登录
                    </Button>
                </div>
            </div>
        </>
    )
}

export default Profile