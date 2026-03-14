import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    IconButton,
    Stack,
    Chip,
    Avatar,
    Divider
} from '@mui/material';
import { Add, MoreHoriz, ChatBubbleOutline } from '@mui/icons-material';
import { SelectedIndexContext } from '../selectItemContext';
import { service } from '../../../service';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { addSprintBulk } from '../../../redux/storage/sprint';

const columns = [
    { id: 'todo', title: 'New', count: 3, color: '#0078d4' },
    { id: 'active', title: 'Active', count: 1, color: '#2b88d8' },
    { id: 'resolved', title: 'Resolved', count: 0, color: '#107c10' },
    { id: 'closed', title: 'Closed', count: 5, color: '#5b5b5b' },
];

const WorkItemCard = ({ title, id, type, user }: { title: string, id: string, type?: string, user: string }) => (
    <Card
        variant="outlined"
        sx={{
            mb: 1,
            cursor: 'pointer',
            borderLeft: '4px solid #0078d4', // Azure's signature task indicator
            '&:hover': { boxShadow: 2 }
        }}
    >
        <CardContent sx={{ p: '12px !important' }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                {id}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1}>
                    <ChatBubbleOutline sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Stack>
                <Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{user}</Avatar>
            </Stack>
        </CardContent>
    </Card>
);

export default function AzureBoard() {
    const projectIndex = useContext(SelectedIndexContext)
    const projects = useAppSelector(s=>s.projectStorage.projects)
    const dispatch = useAppDispatch()
    useEffect(()=>{
        service.projectService.getCurrentSprint(projects[projectIndex.value].id).then(res=>dispatch(addSprintBulk(res)))
    }, [projectIndex])
    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Board Header */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Sprint 120</Typography>
                <Stack direction="row" spacing={1}>
                    <Button size="small" variant="contained" startIcon={<Add />}>New Item</Button>
                    <IconButton size="small"><MoreHoriz /></IconButton>
                </Stack>
            </Stack>

            {/* Board Columns */}
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, flexGrow: 1 }}>
                {columns.map((col) => (
                    <Box
                        key={col.id}
                        sx={{
                            minWidth: 280,
                            width: 280,
                            bgcolor: '#f5f5f5', // Subtle Azure background
                            borderRadius: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Column Header */}
                        <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: col.color }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{col.title}</Typography>
                            <Typography variant="body2" color="text.secondary">({col.count})</Typography>
                        </Box>

                        <Divider />

                        {/* Tasks Container */}
                        <Box sx={{ p: 1, flexGrow: 1 }}>
                            {col.id === 'todo' && (
                                <>
                                    <WorkItemCard id="TASK-102" title="Implement OAuth2 Flow" user="JD" />
                                    <WorkItemCard id="TASK-105" title="Update CSS Variables" user="AS" />
                                </>
                            )}
                            {col.id === 'active' && (
                                <WorkItemCard id="TASK-98" title="Refactor Sidebar Component" user="ME" />
                            )}
                        </Box>

                        {/* Add Item Button at bottom */}
                        <Button
                            fullWidth
                            startIcon={<Add />}
                            sx={{
                                justifyContent: 'flex-start',
                                color: 'text.secondary',
                                textTransform: 'none',
                                p: 1.5
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