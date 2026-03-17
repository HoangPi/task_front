import { getCurrentSprint, getProjects, getSprintBacklogBySprintId, getTaskBySprintBacklogId, getUserByProjectIdAndEmail, updateSprintBacklog, updateTasks } from "./projectService";

export const projectService = {
    getProjects: getProjects,
    getCurrentSprint,
    getSprintBacklogBySprintId,
    getTaskBySprintBacklogId,
    getUserByProjectIdAndEmail,
    updateTasks,
    updateSprintBacklog
}