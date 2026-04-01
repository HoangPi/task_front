import { MembersPage } from "../../member";
import { ProductBacklogPage } from "../backlog/backlog";
import { ProjectOverviewPage } from "../overview";
import { SprintHeader } from "../sprint/sprintView";
// import AzureBacklogPage from "./backlog";
import AzureBoard from "./board";

export function BoardSelector({ path }: { path: string }) {
    switch (path) {
        case ("/dashboard/board"):
            return <AzureBoard />
        case ("/dashboard/backlog"):
            return <ProductBacklogPage />
        case ("/dashboard/sprint"):
            return <SprintHeader />
        case ("/dashboard/members"):
            return <MembersPage />
        case ("/dashboard/overview"):
            return <ProjectOverviewPage />
        default:
            return <AzureBoard />
    }
}