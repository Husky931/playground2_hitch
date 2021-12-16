import { IUser } from "@pinyinma/datatypes"
import { setUser } from "../state/useUser"
import { graphqlTyped } from "../utils/http"

export default async (
    params: Partial<IUser> & { record?: { name: string } },
    queryType: "query" | "mutation",
    queryName: "userSignIn" | "userSignUp" | "userUpdateById"
) => {
    return setUser(await graphqlTyped<IUser, Omit<IUser, "password">>(
        queryType,
            queryName, params, {
                _id: true,
                username: true,
                name: true,
                phone: true,
                wechatOpenId: true,
                accessToken: true,
                createdAt: true
            }
        )
    )
}