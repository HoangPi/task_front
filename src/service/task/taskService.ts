import type { TaskSummary } from "../../redux/storage/taskSummary";
import { axiosService } from "../axiosService";

function getTasksManagedByUser() {
    return axiosService({
        url: "tasks_manager",
        method: "GET"
    })
        .then(res => res.data as TaskSummary[])
        .catch(er => {
            console.log(er)
            throw er
        })
}

export const taskService = {
    getTasksManagedByUser
}