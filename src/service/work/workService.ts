import { axiosService } from "../axiosService";

export type WorkSummary = {
    id: number;
    month: number;
    year: number;
    hours_total: number;
    hours_done: number;
    hours_actually_used: number;
};
function getWorkSummary(taskId: number, quarter: number, year: number): Promise<WorkSummary[]> {
    return axiosService({
        url: 'work_summary',
        method: 'get',
        params: {
            taskId,
            quarter,
            year
        }
    }).then(res => {
        return res.data
    }).catch(er => { throw er })
}

export const WorkService = {
    getWorkSummary
}