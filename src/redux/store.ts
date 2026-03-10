import { configureStore } from '@reduxjs/toolkit'
import userReducer from './storage/user'
import taskRecucer from "./storage/taskSummary"
// ...

export const store = configureStore({
    reducer: {
        user: userReducer,
        taskStorage: taskRecucer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch