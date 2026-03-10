import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { addSummary, addSummaryBulk, clearTasks, getTaskById } from './storage/taskSummary'
import { removeUserInfomation, setUserInfo } from './storage/user'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const reduxService = Object.freeze(
{
    taskService:
    {
        addSummary,
        clearTasks,
        addSummaryBulk,
        getTaskById
    },
    userService:
    {
        setUserInfo,
        removeUserInfomation
    }
})