import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, Typography, Chip, Avatar } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../../components/toast/messageContetx";
import { ToastType } from "../../../components/toast/notification";
import type { Sprint } from "../../../redux/storage/sprint";
import { service } from "../../../service";
import type { Backlog } from "../board/components/sprintCard";
import { SelectedIndexContext } from "../selectItemContext";
import { ProductBacklogList } from "./backlogSelector";

export const SprintPage = ({ sprint, createSprintBacklogHandler }: { sprint: Sprint, createSprintBacklogHandler: (backlogId: number, sprint_id: number) => Promise<void | undefined> }) => {
    const [backlogs, setBacklogs] = useState<Backlog[]>([])
    const projectIndex = useContext(SelectedIndexContext)
    const toastContext = useContext(ToastContext)
    const fetchSprintBacklogs = () => {
        return service.projectService.getSprintBacklogBySprintId(sprint.id)
            .then(result => setBacklogs(result))
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }
    useEffect(() => {
        fetchSprintBacklogs()
    }, [sprint, projectIndex.value])
    return (
        <Box sx={{ p: 3, bgcolor: '#fff', minHeight: '100vh' }}>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="sprint table">
                    <TableHead sx={{ bgcolor: '#faf9f8' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700, width: '50%' }}>Backlog</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {backlogs.map((item) => (
                            <TableRow
                                key={item.id}
                                hover
                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                            >
                                {/* Column: Backlog (Name) */}
                                <TableCell component="th" scope="row">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="caption" sx={{ color: '#0078d4', fontWeight: 800 }}>
                                            ID-{item.id}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                            {item.backlog_name}
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                {/* Column: Status */}
                                <TableCell>
                                    <Chip
                                        label={item.status.replace('_', ' ')}
                                        variant="outlined"
                                        size="small"
                                        sx={{ textTransform: 'capitalize', fontSize: '0.7rem', height: 20 }}
                                    />
                                </TableCell>

                                {/* Column: Assigned To */}
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar
                                            sx={{ width: 24, height: 24, fontSize: '0.65rem', bgcolor: '#0078d4' }}
                                        >
                                            {/* {item.owner.split(' ').map(n => n[0]).join('')} */}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                                {item.owner_name || 'N/A'}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: -0.5 }}>
                                                {item.email || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ProductBacklogList sprint_id={sprint.id} createSprintBacklogHandler={(backlogId: number, sprint_id: number) => {
                return createSprintBacklogHandler(backlogId, sprint_id).then(() => { return fetchSprintBacklogs() })
            }} />
        </Box>
    );
};