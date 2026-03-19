import { useContext, useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Stack,
    Divider,
    LinearProgress,
} from '@mui/material';
import { Add, MoreHoriz, ChevronRight, ChevronLeft } from '@mui/icons-material';
import { SelectedIndexContext } from '../selectItemContext';
import { service } from '../../../service';
import { reduxService, useAppDispatch, useAppSelector } from '../../../redux/hook';
import { clearSprint, getNeighborSprint, hasNext, hasPrev, type Sprint } from '../../../redux/storage/sprint';
import { projectService } from '../../../service/project';
import { type Backlog, WorkItemCard } from './components/sprintCard';
import { ToastContext } from '../../../components/toast/messageContetx';
import { ToastType } from '../../../components/toast/notification';


export default function AzureBoard() {
    const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null)
    const [backlogs, setBacklogs] = useState<Backlog[]>([])

    const projects = useAppSelector(s => s.projectStorage.projects)
    const previousSprint = useAppSelector((state) => getNeighborSprint(state, currentSprint?.id ?? 0, true))
    const nextSprint = useAppSelector((state) => getNeighborSprint(state, currentSprint?.id ?? 0, false))
    const prev = useAppSelector(hasPrev)
    const next = useAppSelector(hasNext)
    const toastContext = useContext(ToastContext)

    const projectIndex = useContext(SelectedIndexContext)
    const dispatch = useAppDispatch()

    const handleFetchSprints = (date: string, before: boolean) => {
        let l_date = date;
        if (date === "") {
            const currentDate = new Date()
            l_date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`
        }
        if (before && previousSprint) {
            setCurrentSprint(previousSprint)
            return
        } if (before === false && nextSprint) {
            setCurrentSprint(nextSprint)
            return
        }
        service.projectService.getCurrentSprint(projects[projectIndex.value].id, l_date, before)
            .then(result => {
                if (result.length) {
                    const hasMoreToFetch = result.length >= 20
                    if (before) {
                        dispatch(reduxService.sprintservice.pushFront({ data: result, hasMoreToFetch }))
                        setCurrentSprint(result[result.length - 1])
                    }
                    else {
                        dispatch(reduxService.sprintservice.pushBack({ data: result, hasMoreToFetch }))
                        setCurrentSprint(result[0])
                    }
                }
            }).catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }

    const diff = useMemo<number>(() => {
        if (!currentSprint) {
            return -1;
        }
        return Math.ceil(((new Date(currentSprint?.end_date)).getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24))
    }, [currentSprint])

    useEffect(() => {
        dispatch(clearSprint());
        service.projectService.getCurrentSprint(projects[projectIndex.value].id)
            .then(res => {
                setCurrentSprint(res[0]);
                dispatch(reduxService.sprintservice.pushBack({ data: res, hasMoreToFetch: true }))
            })
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }, [projectIndex.value])

    const getBacklogs = (currentSprintId: number) => {
        projectService.getSprintBacklogBySprintId(currentSprintId)
            .then(result => setBacklogs(result))
            .catch(() => setBacklogs([]))
    }

    useEffect(() => {
        if (!currentSprint) {
            setBacklogs([])
            return
        }
        getBacklogs(currentSprint.id)
    }, [currentSprint?.id])
    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Board Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>CURRENT/ {currentSprint?.name}</Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" variant="contained" startIcon={<Add />}>New Item</Button>
                    <IconButton size="small"><MoreHoriz /></IconButton>
                </Stack>
            </Stack>
            <div style={{ width: "100%", paddingBottom: 12 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: 'center' }}>
                    {/* Previous Sprint / Start Date Button */}
                    <Button
                        size="small"
                        startIcon={<ChevronLeft />}
                        disabled={!prev && previousSprint === null}
                        onClick={() => { handleFetchSprints(currentSprint?.start_date ?? "", true) }}
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            minWidth: 'auto',
                            p: 0.5
                        }}
                    >
                        {currentSprint?.start_date.split('-').reverse().join('-')}
                    </Button>

                    {/* Next Sprint / End Date Button */}
                    <Button
                        size="small"
                        endIcon={<ChevronRight />}
                        disabled={!next && nextSprint === null}
                        onClick={() => { handleFetchSprints(currentSprint?.end_date ?? "", false) }}
                        sx={{
                            textTransform: 'none',
                            color: 'text.secondary',
                            fontSize: '0.75rem',
                            minWidth: 'auto',
                            p: 0.5
                        }}
                    >
                        {currentSprint?.end_date.split('-').reverse().join('-')}
                    </Button>
                </Box>

                <Typography variant="body2" sx={{ textAlign: 'center', mb: 0.5, fontWeight: 500 }}>
                    {diff > (7 * projects[projectIndex.value].sprint_length)
                        ? "Future sprint"
                        : diff > 0
                            ? `${diff} day${diff > 1 ? "s" : ""} until the end of the sprint`
                            : "Sprint is overdue"}
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={Math.max(0, Math.min(100, 100 - (diff * 100) / (projects[projectIndex.value].sprint_length * 7)))}
                    sx={{ height: 6, borderRadius: 1 }}
                />
            </div>

            {/* Board Columns */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, flexGrow: 1, alignItems: 'stretch' }}>
                {[
                    ["Created", "created"],
                    ["Active", "on_going"],
                    ["Waiting Review", "in_review"],
                    ["Completed", "finished"],
                    ["Failed", "failed"]
                ].map(item => (
                    <Box
                        key={item[0]}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            bgcolor: '#f5f5f5',
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            // Change: Set to 100% so it stretches to the height of the parent
                            height: '100%',
                            border: '1px solid #e1e4e8'
                        }}
                    >
                        {/* Column Header */}
                        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'blue' }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {item[0]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {backlogs?.filter(b => b.status === item[1]).length || 0}
                            </Typography>
                        </Box>

                        <Divider />

                        {/* Tasks Container */}
                        <Box sx={{
                            p: 1,
                            flexGrow: 1, // This pushes the "New Item" button to the bottom
                            minHeight: 100,
                            overflowY: 'auto' // Optional: lets the container scroll if cards exceed page height
                        }}>
                            {backlogs?.filter(b => b.status === item[1]).map(b => (
                                <WorkItemCard key={b.id} backlog={b} reloadBacklogs={getBacklogs} />
                            ))}
                        </Box>

                        {/* Add Item Button */}
                        <Button
                            fullWidth
                            startIcon={<Add />}
                            sx={{
                                justifyContent: 'flex-start',
                                color: 'text.secondary',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                p: 1,
                                mt: 'auto' // Ensures it stays pinned to the bottom of the column
                            }}
                        >
                            New Item
                        </Button>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}