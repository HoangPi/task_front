import { createInvites, createProductBacklog, createProject, createSprint, createSprintBacklog, deleteProject, getCurrentSprint, getProductBacklogs, getProjects, getSprintBacklogBySprintId, getSprintsByRange, getTaskBySprintBacklogId, getUserByProjectIdAndEmail, updateProductBacklog, updateSprintBacklog, updateTasks } from "./projectService";

export const projectService = {
    getProjects: getProjects,
    getCurrentSprint,
    getSprintBacklogBySprintId,
    getTaskBySprintBacklogId,
    getUserByProjectIdAndEmail,
    updateTasks,
    updateSprintBacklog,
    getSprintsByRange,
    getProductBacklogs,
    createSprintBacklog,
    createProductBacklog,
    updateProductBacklog,
    createSprint,
    createProject,
    deleteProject,
    createInvites
}