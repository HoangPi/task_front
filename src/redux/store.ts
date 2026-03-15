import { configureStore } from '@reduxjs/toolkit'
import userReducer from './storage/user'
import projectReducer from './storage/project'
import sprintReducer from './storage/sprint'
// ...

export const store = configureStore({
    reducer: {
        user: userReducer,
        projectStorage: projectReducer,
        sprintStorage: sprintReducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch