import axios, { AxiosError, type AxiosInstance } from "axios";

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
        else {
            config.headers.Authorization = `Bearer ${localStorage.getItem("access")}`
        }
        return config
    },
    // failed request
    (error) => {
        return Promise.reject(error)
    })

axiosService.interceptors.response.use(
    (config) => {
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
                data: {
                    refresh: localStorage.getItem("refresh")
                },
                headers: {
                    "x-retried": true
                }
            }).then((res) => {
                localStorage.setItem("access", res.data.token)
                // The custom service should add the newest token from localstorage
                return axiosService({ ...err.config })
            }).catch(e => { throw e })
        }
        return Promise.reject(err)
    }
)