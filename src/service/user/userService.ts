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
        if (!localStorage.getItem("access")) {
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

export function updateUser(userId: number, name: string, email: string) {
    return axiosService({
        url: '/users',
        method: "PUT",
        data: {
            id: userId,
            name,
            email
        }
    }).then(res => res).catch((e) => { throw e.response.data.message.split("\n")[0] })
}

export function changePassword(userId: number, oldPassword: string, newPassword: string) {
    return axiosService({
        url: '/users/change_password',
        method: "PUT",
        data: {
            id: userId,
            oldPassword,
            newPassword
        }
    }).then(res => res).catch((e) => { console.log(e); throw e.response.data.message.split("\n")[0] || e })
}

export function createUser(username: string, name: string, email: string, password: string) {
    return axiosService({
        url: '/users',
        method: "POST",
        data: {
            username,
            name,
            email,
            password
        }
    }).then(res => res).catch((e) => { console.log(e); throw e.response.data.message.split("\n")[0] || e })
}