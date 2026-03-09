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
            const user: User = jwtDecode<User>(response.data.token)
            console.log(user)
            return user
        })
        .catch(error => { throw error })
}