import type { User } from "../../redux/storage/user";
import { axiosService } from "../axiosService";

export function logIn(username: string, password: string): Promise<User>{
    return axiosService({
        url: '/users/login',
        method: 'post',
        data: {
            username: username,
            password: password
        }
    })
        .then(response => {
            return response.data as User
        })
        .catch(error => { throw error })
}