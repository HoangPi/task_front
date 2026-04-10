import axios, { AxiosError, type AxiosInstance } from "axios";

let access: string | null = null;

export const axiosService: AxiosInstance = axios.create(
    {
        withCredentials: true,
        baseURL: import.meta.env.VITE_SERVER_BASE_URL
    }
)

axiosService.interceptors.request.use(
    // Normal request
    (config) => {
        if (config.url === '/users/login') {
            config.headers.Authorization = undefined
        }
        else if (config.url === '/users/signout') {
            access = null
        }
        else {
            config.headers.Authorization = `Bearer ${access}`
        }
        return config
    },
    // failed request
    (error) => {
        return Promise.reject(error)
    })

axiosService.interceptors.response.use(
    (config) => {
        if (config.config.url === "/users/login" || config.config.url === "/users/refresh") {
            access = config.data.token
        }
        return config
    }, (err: AxiosError) => {
        if (err.status === 401 && (err.response?.data as any).message.split("\n")[0] === 'Token has expired') {
            if (!err.config) {
                return Promise.reject(err)
            }
            if (err.config?.headers["x-retried"]) {
                return Promise.reject(err)
            }

            err.config.headers["x-retried"] = true
            return axiosService({
                url: "/users/refresh",
                method: "POST",
                headers: {
                    "x-retried": true
                }
            }).then((res) => {
                access = res.data.token
                return axiosService({ ...err.config })
            }).catch(e => { throw e })
        }
        return Promise.reject(err)
    }
)