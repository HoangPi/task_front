import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { userSlice } from './user';

export interface Sprint {
    id: number,
    project_id: number,
    name: string,
    goal: string,
    start_date: string,
    end_date: string,
    status: string
}

// Define the initial state using that type
const initialState: { sprints: Sprint[] } = { sprints: [] }

export const sprintSlice = createSlice({
    name: 'listOfTasks',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // addSprint: (state, action: PayloadAction<Sprint>) => {
        //     state.sprints.push(action.payload)
        // },
        addSprintBulk: (state, action: PayloadAction<Sprint[]>) => {
            action.payload.forEach(item => {
                if (!state.sprints.find(store => store.id === item.id)) {
                    state.sprints.push(item);
                }
            })
        },
        clearSprint: (state) => { state.sprints = [] }
    },
    extraReducers: (builder) => {
        builder.addCase(userSlice.actions.removeUserInfomation, (state) => {
            state.sprints = []
        })
    }
})

export const { /*addSprint, */clearSprint, addSprintBulk } = sprintSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getSprintById = (state: RootState, id: number) => {
    return state.sprintStorage.sprints.find((item) => item.id === id)
}

export default sprintSlice.reducer