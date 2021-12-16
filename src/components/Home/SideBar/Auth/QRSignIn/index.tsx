import React from "react"
import { Fab } from "@mui/material"
import QRCode from "qrcode.react"
import { useQrSignInScanned } from "../../../../../state/useQrSignInScanned"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useClientId } from "../../../../../state/useClientId"
import { baseURL } from "../../../../../utils/http"

const QRSignIn: React.FC = () => {
    const [qrSignInScanned, setQrSignInScanned] = useQrSignInScanned()
    const [clientId] = useClientId()
    const qrUrl = `${baseURL}/qr-signin?id=${clientId}`

    return (
        <>
            <div className="text-center opacity-50 mb-4">
                打开微信，扫码登录
            </div>
            <div className="w-48 h-48 mx-auto flex items-center justify-center bg-white shadow-xl">
                <QRCode value={qrUrl} className="w-40 h-40" />
                {qrSignInScanned && (
                    <div className="absfull flex justify-center items-center">
                        <div className="absfull bg-black opacity-75" />
                        <div>
                            <div className="w-full text-center mb-4">
                                扫码成功，等待授权
                            </div>
                            <div className="w-full flex justify-center">
                                <Fab
                                 className="mx-auto"
                                 variant="extended"
                                 size="small"
                                 onClick={() => setQrSignInScanned(false)}
                                >
                                    <RefreshIcon />
                                    重新扫描 
                                </Fab>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default QRSignIn