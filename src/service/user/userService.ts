import type { User } from "../../redux/storage/user";
import { axiosService } from "../axiosService";
import { jwtDecode } from "jwt-decode"

export function logIn(username: string, password: string): Promise<User> {
    return axiosService({
        url: '/users/login',
        method: 'post',
        data: {
            username: username,
            password: password
        }
    })
        .then(response => {
            localStorage.setItem("access", response.data.token)
            return jwtDecode<User>(response.data.token)
        })
        .catch(error => { throw error })
}

export async function VerifyUserSession(): Promise<User> {
    try {
        if(!localStorage.getItem("access")){
            throw "Access token not found"
        }
        const res = await axiosService({
            url: `/users`
        })
        res.data.userId = res.data.id
        return res.data as User
    }
    catch (e) {
        throw e
    }
}