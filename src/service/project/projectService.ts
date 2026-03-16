import type { Backlog } from "../../pages/project/board/components/sprintCard"
import type { LocalTask, Task } from "../../pages/project/board/components/sprintDialog"
import type { Project } from "../../redux/storage/project"
import type { Sprint } from "../../redux/storage/sprint"
import { axiosService } from "../axiosService"

export function getProjects(): Promise<Project[]> {
    return axiosService({
        url: "projects",
        method: "GET"
    })
        .then(res => {
            return res.data as Project[]
        })
        .catch(e => { throw e })
}

export function getCurrentSprint(projectId: number, date?: string, before?: boolean): Promise<Sprint[]> {
    let startDate = new Date();
    let endDate = new Date();
    if (date) {
        if (before) {
            startDate = new Date("1970-01-01");
            endDate = new Date(date)
            endDate.setDate(endDate.getDate() - 1)
        }
        else {
            endDate = new Date("9999-1-1")
            startDate = new Date(date)
            startDate.setDate(startDate.getDate() + 1)
        }
    }
    const startDateString = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`
    const endDateString = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
    const url = `sprints?projectId=${projectId}&start=${startDateString}&end=${endDateString}`
    return axiosService({
        url,
        method: "GET"
    })
        .then(res => {
            return res.data as Sprint[]
        })
        .catch(e => { throw e })
}

export function getSprintBacklogBySprintId(sprintId: number) {
    return axiosService({
        url: `/sprints/backlog?sprintId=${sprintId}`,
        method: "GET"
    }).then(res => res.data as Backlog[]).catch(e => { throw e })
}

export function getTaskBySprintBacklogId(sprintBacklogId: number) {
    return axiosService({
        url: `/sprints/tasks?sprintBacklogId=${sprintBacklogId}`,
        method: "GET"
    }).then(res => res.data as Task[]).catch(e => { throw e })
}

export type UserSimpleInfo = { id: number | null, name: string | null, email: string | null }

export function getUserByProjectIdAndEmail(projectId: number, email: string) {
    return axiosService({
        url: `/project/member?projectId=${projectId}&email=${email}`,
        method: "GET"
    }).then(res => res.data as UserSimpleInfo[]).catch(er => { throw er })
}

type CreateTask = {
    user_id: number | null,
    sprint_backlog_id: number,
    story_point: number,
    finished: boolean,
    name: string
}

interface UpdateTask extends CreateTask {
    id: number
}

export function updateTasks(tasks: LocalTask[]) {
    const create: CreateTask[] = tasks.filter(item => item.state === "new").map(item => ({
        user_id: item.user_id,
        sprint_backlog_id: item.sprint_backlog_id,
        story_point: item.story_point,
        finished: item.finished,
        name: item.name
    }))
    const update: UpdateTask[] = tasks.filter(item => item.state === "updated").map(item => ({
        user_id: item.user_id,
        sprint_backlog_id: item.sprint_backlog_id,
        story_point: item.story_point,
        finished: item.finished,
        name: item.name,
        id: item.id
    }))
    const deleted: { id: number, sprint_backlog_id: number }[] = tasks
        .filter(item => item.state === "deleted")
        .map(item => ({ id: item.id, sprint_backlog_id: item.sprint_backlog_id }))

    return axiosService({
        url: `/sprints/tasks`,
        method: "PUT",
        data: {
            create,
            update,
            deleted
        }
    }).then(res => res.data as UserSimpleInfo[]).catch(er => { throw er })
}