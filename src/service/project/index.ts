import {
    createInvites, createProductBacklog, createProject, createSprint, createSprintBacklog,
    deleteProject, finishOverdueSprints, finishSprint, getCurrentSprint, getMembersOfProject, getProductBacklogs, getProjectOverview,
    getProjects, getSprintBacklogBySprintId, getSprintsByRange, getTaskBySprintBacklogId,
    getUserByProjectIdAndEmail, updateProductBacklog, updateRole, updateSprintBacklog, updateTasks
} from "./projectService";

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
    createInvites,
    getMembersOfProject,
    getProjectOverview,
    updateRole,
    finishOverdueSprints,
    finishSprint
}