import axios, { type AxiosInstance } from "axios";

export const axiosService: AxiosInstance = axios.create(
    {
        withCredentials: true,
        baseURL: import.meta.env.VITE_SERVER_BASE_URL
    }
)

axiosService.interceptors.request.use(
    // Normal request
    (config) => {
        if(config.url === '/users/login')
        {
            config.headers.Authorization = undefined
        }
        config.headers.Authorization = `Bearer ${localStorage.getItem("access")}`
        return config
    },
    // failed request
    (error) => {
        return Promise.reject(error)
    })