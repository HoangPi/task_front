import {
    Box,
    Typography,
    Card,
    CardContent,
    Stack,
    Divider,
    LinearProgress,
    Grid
} from '@mui/material';
import {
    AssignmentOutlined,
    CheckCircleOutline,
    HighlightOffOutlined,
    PlaylistAddCheckOutlined
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { useAppSelector } from '../../../redux/hook';
import { SelectedIndexContext } from '../selectItemContext';
import { service } from '../../../service';

export interface ProjectOverview {
    total_product_backlogs: number,
    finished_product_backlogs: number,
    total_story_points: number,
    finished_story_points: number,
    total_user_stories: number,
    finished_user_stories: number,
    failed_user_stories: number
};

export const ProjectOverviewPage = () => {
    // Calculate backlog progress percentage
    const projects = useAppSelector(s => s.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext);
    const [projectOverview, setProjectOverview] = useState<ProjectOverview | null>(null);
    useEffect(() => {
        if (projects.length > 0 && projectIndex.value !== -1) {
            service.projectService.getProjectOverview(projects[projectIndex.value].id)
                .then(res => {
                    if (res.length >= 0) {
                        setProjectOverview(res[0])
                    }
                    else {
                        throw ""
                    }
                })
        }
    }, [projectIndex.value])

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto', bgcolor: '#fff', minHeight: '100vh' }}>

            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#323130' }}>
                Project Overview
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                High-level metrics and current progress of your project.
            </Typography>

            <Grid container spacing={3}>

                {/* --- Card 1: Product Backlogs --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderColor: '#edebe9',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            height: '100%'
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, bgcolor: '#eff6fc', borderRadius: 1, color: '#0078d4', display: 'flex' }}>
                                    <AssignmentOutlined />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#323130' }}>
                                    Product Backlogs
                                </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 2 }}>
                                <Typography variant="h3" sx={{ fontWeight: 700, color: '#323130' }}>
                                    {projectOverview?.finished_product_backlogs}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    / {projectOverview?.total_product_backlogs} Finished
                                </Typography>
                            </Stack>

                            <Box sx={{ width: '100%', mr: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        !projectOverview?.total_product_backlogs
                                            ? 0
                                            : (projectOverview.finished_product_backlogs || 0) * 100 / projectOverview.total_product_backlogs
                                    }
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        bgcolor: '#edebe9',
                                        '& .MuiLinearProgress-bar': { bgcolor: '#107c10' } // Green success color
                                    }}
                                />
                            </Box>
                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                                {Math.round(!projectOverview?.total_product_backlogs
                                    ? 0
                                    : (projectOverview.finished_product_backlogs || 0) * 100 / projectOverview.total_product_backlogs)}% completion rate
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* --- Card 2: User Stories Breakdown --- */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            borderColor: '#edebe9',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            height: '100%'
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, bgcolor: '#f3f2f1', borderRadius: 1, color: '#605e5c', display: 'flex' }}>
                                    <PlaylistAddCheckOutlined />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#323130' }}>
                                    User Stories
                                </Typography>
                            </Stack>

                            <Stack spacing={2}>
                                {/* Total Created */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#605e5c' }}>
                                        Total Created
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#323130' }}>
                                        {projectOverview?.total_user_stories}
                                    </Typography>
                                </Stack>

                                <Divider sx={{ borderColor: '#f3f2f1' }} />

                                {/* Finished */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <CheckCircleOutline sx={{ color: '#107c10', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#323130' }}>
                                            Finished
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#107c10' }}>
                                        {projectOverview?.finished_user_stories}
                                    </Typography>
                                </Stack>

                                {/* Failed */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <HighlightOffOutlined sx={{ color: '#d13438', fontSize: 20 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#323130' }}>
                                            Failed
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#d13438' }}>
                                        {projectOverview?.failed_user_stories}
                                    </Typography>
                                </Stack>

                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Box>
    );
};