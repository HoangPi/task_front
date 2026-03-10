import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { userSlice } from './user';

// Define a type for the slice state
export interface TaskSummary {
    id: number;
    name: string;
    created_at: number;
    hours_total: number | null;
    hours_assigned: number | null;
    hours_done: number | null;
    hours_actually_used: number | null;
    jobs_completed: number | null;
    jobs_aborted: number | null;
    number_of_members: number;
}

// Define the initial state using that type
const initialState: { tasks: TaskSummary[] } = { tasks: [] }

export const taskSlice = createSlice({
    name: 'listOfTasks',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addSummary: (state, action: PayloadAction<TaskSummary>) => {
            state.tasks.push(action.payload)
        },
        addSummaryBulk: (state, action: PayloadAction<TaskSummary[]>) => {
            state.tasks = action.payload
        },
        clearTasks: (state) => { state.tasks = [] }
    },
    extraReducers: (builder) => {
        builder.addCase(userSlice.actions.removeUserInfomation, (state) => {
            state.tasks = []
        })
    }
})

export const { addSummary, clearTasks, addSummaryBulk } = taskSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getTaskById = (state: RootState, id: number) => {
    for (let i = 0; i < state.taskStorage.tasks.length; i++) {
        if (state.taskStorage.tasks[i].id === id) {
            return state.taskStorage.tasks[i]
        }
    }
    throw "WHERE"
}

export default taskSlice.reducer