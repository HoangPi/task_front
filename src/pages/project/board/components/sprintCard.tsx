import { ChatBubbleOutline } from "@mui/icons-material";
import { Avatar, Box, Card, CardContent, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { WorkItemDialog } from "./sprintDialog";

export interface Backlog {
    id: number;
    sprint_id: number;
    backlog_item_id: number;
    backlog_name: string;
    priority: number;
    task_owner: number | null;
    owner_name: string | null;
    email: string | null;
    status: 'on_going' | 'created' | 'in_review' | 'completed' | 'failed' | string;
    notes: string;
    estimated_story_point: number;
    actual_story_point: number;
}

const getPriorityColor = (priority: number) => {
    switch (priority) {
        case 1: return '#d83b01'; // Critical/High - Red
        case 2: return '#ffb900'; // Medium - Yellow/Orange
        case 3: return '#0078d4'; // Low - Blue
        default: return '#8a8886'; // Routine - Grey
    }
};

export const WorkItemCard = ({ backlog, reloadBacklogs }: { backlog: Backlog, reloadBacklogs: (currentSprintId: number) => void }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = (e: any) => {
        if (e) e.stopPropagation();
        reloadBacklogs(backlog.sprint_id)
        setOpen(false);
    };

    return (
        <>
            <Card
                variant="outlined"
                onClick={handleOpen}
                sx={{
                    mb: 1.5,
                    cursor: 'pointer',
                    borderLeft: '4px solid #0078d4',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        borderColor: '#0078d4',
                        transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
            >
                <CardContent sx={{ p: '12px !important' }}>
                    {/* 1. Noticeable Backlog Name */}
                    <Box sx={{ mb: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                color: '#0078d4',
                                bgcolor: '#ebf3fc',
                                px: 0.8, py: 0.2, borderRadius: 0.5,
                                textTransform: 'uppercase'
                            }}
                        >
                            {backlog.backlog_name}
                        </Typography>
                    </Box>

                    {/* 2. Owner Name */}
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.2, color: '#323130' }}>
                        {backlog.owner_name || "Unassigned"}
                    </Typography>

                    {/* 3. Email Subtext */}
                    <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: 'text.secondary', fontStyle: 'italic' }}>
                        {backlog.email || "no-email@domain.com"}
                    </Typography>

                    {/* 4. Priority & Story Points Row */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <Tooltip title={`Priority ${backlog.priority}`}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid #edebe9', px: 0.5, borderRadius: 1 }}>
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: getPriorityColor(backlog.priority) }} />
                                <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>P{backlog.priority}</Typography>
                            </Box>
                        </Tooltip>

                        <Box sx={{ px: 0.8, borderRadius: 1, bgcolor: '#f3f2f1', border: '1px solid #edebe9' }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#323130', fontSize: '0.7rem' }}>
                                {backlog.actual_story_point || 0}/{backlog.estimated_story_point || 0} SP
                            </Typography>
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 1, opacity: 0.5 }} />

                    {/* 5. Bottom Row (Comments & Avatar) */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <ChatBubbleOutline sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">0</Typography>
                        </Stack>

                        <Avatar
                            sx={{
                                width: 24, height: 24, fontSize: 10, bgcolor: '#0078d4', fontWeight: 700,
                                border: '1px solid #fff', boxShadow: '0 0 0 1px #0078d4'
                            }}
                        >
                            {backlog.owner_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                        </Avatar>
                    </Stack>
                </CardContent>
            </Card>

            {/* LARGE CENTERED DIALOG */}

            <WorkItemDialog open={open} handleClose={handleClose} backlog={backlog} />
        </>
    );
};