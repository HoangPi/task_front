import { getCurrentSprint, getProjects, getSprintBacklogBySprintId, getTaskBySprintBacklogId, getUserByProjectIdAndEmail, updateTasks } from "./projectService";

export const projectService = {
    getProjects: getProjects,
    getCurrentSprint,
    getSprintBacklogBySprintId,
    getTaskBySprintBacklogId,
    getUserByProjectIdAndEmail,
    updateTasks
}