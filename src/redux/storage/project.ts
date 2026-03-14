import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { userSlice } from './user';

export interface Project {
    id: number,
    project_owner: number,
    name: string,
    description: string,
    sprint_length: number,
    sprint_start_day: number,
    work_day_hour: number,
    default_day_off: number,
    day_off: string[],
    status: string | 'active'
}

// Define the initial state using that type
const initialState: { projects: Project[] } = { projects: [] }

export const projectSlice = createSlice({
    name: 'listOfTasks',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.push(action.payload)
        },
        addProjectBulk: (state, action: PayloadAction<Project[]>) => {
            state.projects = action.payload
        },
        clearProject: (state) => { state.projects = [] }
    },
    extraReducers: (builder) => {
        builder.addCase(userSlice.actions.removeUserInfomation, (state) => {
            state.projects = []
        })
    }
})

export const { addProject, clearProject, addProjectBulk } = projectSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getProjectById = (state: RootState, id: number) => {
    for (let i = 0; i < state.projectStorage.projects.length; i++) {
        if (state.projectStorage.projects[i].id === id) {
            return state.projectStorage.projects[i]
        }
    }
    throw "WHERE"
}

export default projectSlice.reducer