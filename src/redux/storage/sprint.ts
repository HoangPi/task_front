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
const initialState: {
    sprints: Sprint[],
    hasPreviousItem: boolean,
    hasNextItem: boolean
} = {
    sprints: [],
    hasNextItem: true,
    hasPreviousItem: true
}

export const sprintSlice = createSlice({
    name: 'sprint',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        pushBack: (state, action: PayloadAction<{data: Sprint[], hasMoreToFetch: boolean}>) => {
            if(state.hasNextItem)
            {
                state.hasNextItem = action.payload.hasMoreToFetch
            }
            action.payload.data.forEach(item => {
                if (!state.sprints.find(store => store.id === item.id)) {
                    state.sprints.push(item);
                }
            })
        },
        pushFront: (state, action: PayloadAction<{data: Sprint[], hasMoreToFetch: boolean}>) => {
            if(state.hasPreviousItem)
            {
                state.hasPreviousItem = action.payload.hasMoreToFetch
            }
            action.payload.data
                .slice()
                .reverse()
                .forEach(item => {
                    if (!state.sprints.find(store => store.id === item.id)) {
                        state.sprints.unshift(item);
                    }
                });
        },
        clearSprint: (state) => { state.sprints = [] }
    },
    extraReducers: (builder) => {
        builder.addCase(userSlice.actions.removeUserInfomation, (state) => {
            state.sprints = []
            state.hasNextItem = true
            state.hasPreviousItem = true
        })
    }
})

export const { /*addSprint, */clearSprint, pushBack, pushFront } = sprintSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const getSprintById = (state: RootState, id: number) => {
    return state.sprintStorage.sprints.find((item) => item.id === id)
}
export const getNeighborSprint = (state: RootState, currentSprintId: number, isBefore: boolean): Sprint | null => {
    const index = state.sprintStorage.sprints.findIndex((item) => item.id === currentSprintId);
    if (index < 0) {
        return null
    }
    if (isBefore) {
        if (index <= 0) {
            return null;
        }
        return state.sprintStorage.sprints[index - 1];
    }
    if (index >= (state.sprintStorage.sprints.length - 1)) {
        return null;
    }
    return state.sprintStorage.sprints[index + 1]
}

export const hasPrev = (state: RootState) => state.sprintStorage.hasPreviousItem
export const hasNext = (state: RootState) => state.sprintStorage.hasNextItem

export default sprintSlice.reducer