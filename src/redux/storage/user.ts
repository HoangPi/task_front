import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '../store'

// Define a type for the slice state
interface User {
    id: number | null,
    username: string | null,
    name: string | null,
    email: string | null,
    role: 'admin' | 'user',
    notifications: number
}

// Define the initial state using that type
const initialState: User = {
    id: null,
    username: null,
    name: null,
    email: null,
    role: 'user',
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