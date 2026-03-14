import type { Project } from "../../redux/storage/project"
import type { Sprint } from "../../redux/storage/sprint"
import { axiosService } from "../axiosService"

export function getProjects(): Promise<Project[]> {
    return axiosService({
        url: "projects",
        method: "GET"
    })
        .then(res => {
            console.log(res.data)
            return res.data as Project[]
        })
        .catch(e => { throw e })
}

export function getCurrentSprint(projectId: number): Promise<Sprint[]> {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    const url = `sprints?projectId=${projectId}&start=${todayString}&end=${todayString}`
    return axiosService({
        url,
        method: "GET"
    })
        .then(res => {
            console.log(res.data)
            return res.data as Sprint[]
        })
        .catch(e => { throw e })
}