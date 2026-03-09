import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'

// Define a type for the slice state
export interface User {
    userId: number | null,
    username: string | null,
    name: string | null,
    email: string | null,
    role: 'ROLE_ADMIN' | 'ROLE_GUEST',
    notifications: number
}

// Define the initial state using that type
const initialState: User = {
    userId: null,
    username: null,
    name: null,
    email: null,
    role: 'ROLE_GUEST',
    notifications: 0
}

export const counterSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        removeUserInfomation: (state) => {
            Object.assign(state, initialState)
        },
        setUserInfo: (state, action: PayloadAction<User>) => {
            Object.assign(state, action.payload)
        }
    },
})

export const { removeUserInfomation, setUserInfo } = counterSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default counterSlice.reducer