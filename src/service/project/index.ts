import { getCurrentSprint, getProjects, getSprintBacklogBySprintId } from "./projectService";

export const projectService = {
    getProjects: getProjects,
    getCurrentSprint,
    getSprintBacklogBySprintId
}