import React from "react"
import LayersIcon from "@mui/icons-material/LayersOutlined"
import AccountBalanceIcon from "@mui/icons-material/AccountBalanceOutlined"
import Brightness6OutlinedIcon from "@mui/icons-material/Brightness6Outlined"
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined"
import WbTwilightOutlinedIcon from "@mui/icons-material/WbTwilightOutlined"
import FlashlightOnOutlinedIcon from "@mui/icons-material/FlashlightOnOutlined"
import HighlightOutlinedIcon from "@mui/icons-material/HighlightOutlined"

//@ts-ignore
import cubeSrc from "./cube.svg"
//@ts-ignore
import sphereSrc from "./sphere.svg"
//@ts-ignore
import cylinderSrc from "./cylinder.svg"
//@ts-ignore
import coneSrc from "./cone.svg"
//@ts-ignore
import torusSrc from "./torus.svg"
//@ts-ignore
import tetrahedronSrc from "./tetrahedron.svg"
//@ts-ignore
import octahedronSrc from "./octahedron.svg"
//@ts-ignore
import circleSrc from "./circle.svg"
//@ts-ignore
import squareSrc from "./square.svg"

const StyledImg: React.FC<{ src: string }> = ({ src }) => {
    return (
        <img src={src} width={14} className="pointer-events-none" style={{ marginLeft: 2 }} />
    )
}

export default () => Object.entries({
    cube: <StyledImg src={cubeSrc} />,
    sphere: <StyledImg src={sphereSrc} />,
    cylinder: <StyledImg src={cylinderSrc} />,
    cone: <StyledImg src={coneSrc} />,
    torus: <StyledImg src={torusSrc} />,
    tetrahedron: <StyledImg src={tetrahedronSrc} />,
    octahedron: <StyledImg src={octahedronSrc} />,
    circle: <StyledImg src={circleSrc} />,
    plane: <StyledImg src={squareSrc} />,
    model: <LayersIcon fontSize="small" />,
    scene: <AccountBalanceIcon fontSize="small" />,
    ambientLight: <Brightness6OutlinedIcon fontSize="small" />,
    skyLight: <WbTwilightOutlinedIcon fontSize="small" />,
    directionalLight: <FlashlightOnOutlinedIcon fontSize="small" />,
    pointLight: <WbSunnyOutlinedIcon fontSize="small" />,
    spotLight: <HighlightOutlinedIcon fontSize="small" />
})