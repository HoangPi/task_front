import { getCurrentSprint, getProjects, getSprintBacklogBySprintId, getTaskBySprintBacklogId } from "./projectService";

export const projectService = {
    getProjects: getProjects,
    getCurrentSprint,
    getSprintBacklogBySprintId,
    getTaskBySprintBacklogId
}