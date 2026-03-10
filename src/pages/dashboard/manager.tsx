import { useEffect } from "react"
import { taskService } from "../../service/task/taskService"
import { reduxService, useAppDispatch, useAppSelector } from "../../redux/hook"

export const ManagerOverview = () => {
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(state => state.taskStorage.tasks)
    useEffect(() => {
        if (tasks.length !== 0) return

        taskService.getTasksManagedByUser()
            .then(res => {
                dispatch(reduxService.taskService.addSummaryBulk(res))
            })
            .catch((e) => {
                console.log(e)
            })
    }, [])
    return <>
        <h1>Hello there</h1>
    </>
}