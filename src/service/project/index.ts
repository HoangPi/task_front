import { getCurrentSprint, getProjects, getSprintBacklogBySprintId, getTaskBySprintBacklogId, getUserByProjectIdAndEmail } from "./projectService";

export const projectService = {
    getProjects: getProjects,
    getCurrentSprint,
    getSprintBacklogBySprintId,
    getTaskBySprintBacklogId,
    getUserByProjectIdAndEmail
}