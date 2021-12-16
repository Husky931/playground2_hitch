import React from "react"
import { Button } from "@mui/material"
import Lessons from "./Lessons"
import { useTheme } from "@pinyinma/playground-theme"
import { useHome } from "../../state/useHome"
import SideBar from "./SideBar"
import ProjectManager from "./ProjectManager"
import LessonManager from "./LessonManager"
import ModelManager from "./ModelManager"
import WebLessons from "./WebLessons"
import { HOME_SIDEBAR_WIDTH, RASPBERRY } from "../../globals"
import Auth from "./SideBar/Auth"
import { useUser } from "../../state/useUser"
import userSignOut from "../../actions/user/userSignOut"
import dedent from "ts-dedent"
import ICP from "../ICP"
import DropZone from "../DropZone"

const Home: React.FC = () => {
    const [theme] = useTheme()
    const [home] = useHome()
    const [user] = useUser()

    return (
        <DropZone className="absfull flex justify-center items-center text-white" style={{
            background: theme.customPalette.background.darker0
        }}>
            <div
             className={RASPBERRY ? "absfull" : "w-11/12 xl:w-10/12"}
             style={RASPBERRY ? undefined : {
                minWidth: 800,
                maxWidth: 1280,
                height: "90%",
                minHeight: 480,
                maxHeight: 1280
             }}
            >
                <div className="absfull rounded-2xl shadow-xl" style={{
                    background: theme.customPalette.background.default
                }}>
                    {RASPBERRY ? (
                        user ? (
                            <div className="absfull flex flex-col">
                                <Button variant="contained" fullWidth  onClick={userSignOut}>
                                    退出登录
                                </Button>
                                <ProjectManager gradientSkip={4} />
                            </div>
                        ) : <>
                            <ICP />
                            <Auth />
                        </>
                    ) : (
                        <div className="absfull grid" style={{
                            gridTemplateAreas: dedent`
                                "sidebar content"
                            `,
                            gridTemplateColumns: `${HOME_SIDEBAR_WIDTH}px minmax(0, 1fr)`,
                        }}>
                            {home === "lessons" && <Lessons />}
                            {home === "webLessons" && <WebLessons gradientSkip={3} />}
                            {home === "projectManager" && <ProjectManager gradientSkip={4} />}
                            {home === "lessonManager" && <LessonManager gradientSkip={5} />}
                            {home === "modelManager" && <ModelManager gradientSkip={6} />}
                            <SideBar style={{ gridArea: "sidebar" }} />
                        </div>
                    )}
                </div>
            </div>
        </DropZone>
    )
}

export default Home