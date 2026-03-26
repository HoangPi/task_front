import type { MemberInfoWithRole } from "../../pages/member"
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
        .catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function getSprintsByRange(projectId: number, start: string, end: string): Promise<Sprint[]> {
    const url = `sprints?projectId=${projectId}&start=${start}&end=${end}`
    return axiosService({
        url,
        method: "GET"
    }).then(res => res.data as Sprint[]).catch(e => { throw e.response.data.message.split("\n")[0] })
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
        .catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function getSprintBacklogBySprintId(sprintId: number) {
    return axiosService({
        url: `/sprints/backlog?sprintId=${sprintId}`,
        method: "GET"
    }).then(res => res.data as Backlog[]).catch(e => { throw e }).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function getTaskBySprintBacklogId(sprintBacklogId: number) {
    return axiosService({
        url: `/sprints/tasks?sprintBacklogId=${sprintBacklogId}`,
        method: "GET"
    }).then(res => res.data as Task[]).catch(e => { throw e }).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export type UserSimpleInfo = { id: number | null, name: string | null, email: string | null }

export function getUserByProjectIdAndEmail(projectId: number, email: string) {
    return axiosService({
        url: `/project/member?projectId=${projectId}&email=${email}`,
        method: "GET"
    }).then(res => res.data as UserSimpleInfo[]).catch(er => { throw er }).catch(e => { throw e.response.data.message.split("\n")[0] })
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
    }).then(res => res.data as UserSimpleInfo[]).catch(er => { throw er.response.data.message.split("\n")[0] })
}

export function updateSprintBacklog(sprintBacklog: {
    id: number,
    status: 'on_going' | 'created' | 'in_review' | 'completed' | 'failed' | string,
    taskOwner: number | null,
    notes: string
}) {
    return axiosService({
        url: `/sprints/backlog`,
        method: "PUT",
        data: {
            ...sprintBacklog
        }
    }).then(res => res.data as UserSimpleInfo[]).catch(er => { throw er.response.data.message.split("\n")[0] })
}

export type ProductBacklog = {
    id: number;
    project_id: number;
    name: string;
    acceptance_criteria: string;
    priority: number;
    status: "created" | "on_going" | "finished" | string;
    story_point: number;
};

export function getProductBacklogs(projectId: number, offset: number,
    nameFilter: string | null,
    includeFinished: boolean | null,
    ascStoryPoint: boolean | null,
    ascPriority: boolean | null) {

    const url = `/project/backlog/query?projectId=${projectId}&offset=${offset}${nameFilter !== null ? `&name=${(nameFilter)}` : "&name="}${includeFinished !== null ? `&finished=${includeFinished}` : ""}${ascStoryPoint !== null ? `&storyPoint=${ascStoryPoint}` : ""}${ascPriority !== null ? `&priority=${ascPriority}` : ""}`
    return axiosService({
        url,
        method: "GET"
    }).then(res => res.data as ProductBacklog[]).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function createSprintBacklog(product_backlog_id: number, sprint_id: number) {

    return axiosService({
        url: 'sprints/backlog',
        method: "POST",
        data: {
            product_backlog_id,
            sprint_id,
            note: ""
        }
    }).then((res) => res).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function createProductBacklog(backlog: ProductBacklog) {

    return axiosService({
        url: 'project/backlog',
        method: "POST",
        data: {
            "project_id": backlog.project_id,
            "name": backlog.name,
            "acceptance_criteria": backlog.acceptance_criteria,
            "priority": backlog.priority,
            "story_point": backlog.story_point
        }
    }).then((res) => res).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function updateProductBacklog(backlog: ProductBacklog) {

    return axiosService({
        url: 'backlog',
        method: "PUT",
        data: {
            "id": backlog.id,
            "project_id": backlog.project_id,
            "name": backlog.name,
            "acceptance_criteria": backlog.acceptance_criteria,
            "priority": backlog.priority,
            "story_point": backlog.story_point
        }
    }).then((res) => res).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function createSprint(project_id: number, name: string, goal: string, start_date: string) {
    return axiosService({
        url: "sprints",
        method: "POST",
        data: {
            project_id,
            name,
            goal,
            start_date
        }
    }).catch(e => { throw e.response.data.message.split("\n")[0] })
}

// TODO Make payload not any type
export function createProject(payload: any) {
    return axiosService({
        url: "project",
        method: "POST",
        data: {
            ...payload
        }
    }).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function deleteProject(projectId: number) {
    return axiosService({
        url: `project/${projectId}`,
        method: "DELETE"
    }).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function createInvites(projectId: number, invitees: number[]) {
    return axiosService({
        url: `invite/projects/many`,
        method: "POST",
        data: {
            project_id: projectId,
            invitees
        }
    }).catch(e => { throw e.response.data.message.split("\n")[0] })
}

export function getMembersOfProject(projectId: number, type: 'EM' | string, offset: number) {
    return axiosService({
        url: `project/members?projectId=${projectId}&type=${type}&offset=${offset}`,
        method: "GET"
    }).then((res) => res.data as MemberInfoWithRole[]).catch(e => { throw e.response.data.message.split("\n")[0] })
}