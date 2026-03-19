import { SprintHeader } from "../sprint/sprintView";
import AzureBacklogPage from "./backlog";
import AzureBoard from "./board";

export function BoardSelector({path}: {path: string}){
    switch (path){
        case ("/dashboard/board"):
            return <AzureBoard />
        case ("/dashboard/backlog"):
            return <AzureBacklogPage />
        case ("/dashboard/sprint"):
            return <SprintHeader />
        default:
            return <AzureBoard />
    }
}