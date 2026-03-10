import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
export interface TaskSummary {
    id: number;
    name: string;
    createdAt: number;
    hoursTotal: number;
    hoursAssigned: number;
    hoursDone: number;
    hoursActuallyUsed: number;
    jobsCompleted: number;
    jobsAborted: number;
    numberOfMembers: number;
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
        clearTasks: (state) => { state.tasks = [] }
    },
})

export const { addSummary, clearTasks } = taskSlice.actions

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