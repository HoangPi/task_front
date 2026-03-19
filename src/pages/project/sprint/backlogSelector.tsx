import { Search, FiberManualRecord, ArrowUpward, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Divider, Grid, Card, CardContent, Chip, Button } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { ToastContext } from "../../../components/toast/messageContetx";
import { ToastType } from "../../../components/toast/notification";
import useDebounce from "../../../hooks/use-debounce";
import { useAppSelector } from "../../../redux/hook";
import { service } from "../../../service";
import type { ProductBacklog } from "../../../service/project/projectService";
import { SelectedIndexContext } from "../selectItemContext";

// --- Helper for Priority Colors ---
const getPriorityStyles = (priority: number) => {
    switch (priority) {
        case 1: return { color: '#d83b01', label: 'High' }; // Red-Orange
        case 2: return { color: '#ffb900', label: 'Medium' }; // Yellow
        case 3: return { color: '#0078d4', label: 'Low' }; // Blue
        default: return { color: '#8a8886', label: 'None' };
    }
};

export const ProductBacklogList = ({ sprint_id, createSprintBacklogHandler }: { sprint_id: number, createSprintBacklogHandler: (backlogId: number, sprint_id: number) => Promise<void | undefined> }) => {
    const [productBacklogs, setProductBacklogs] = useState<ProductBacklog[]>([])
    const [nameFilter, setNameFilter] = useState("")
    const nameFilterDebounce = useDebounce(nameFilter, 500)
    const [offset, setOffset] = useState(0)
    const [ascStoryPoint, setAscStoryPoint] = useState<boolean | null>(null)
    const [ascPriority, setAscPriority] = useState<boolean | null>(null)
    const projects = useAppSelector(state => state.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext);
    const toastContext = useContext(ToastContext)
    const fetchBacklogs = () => {
        if (projects.length <= 0) {
            return
        }
        service.projectService.getProductBacklogs(
            projects[projectIndex.value].id,
            offset,
            nameFilterDebounce,
            null,
            ascStoryPoint,
            ascPriority
        ).then(result => setProductBacklogs(result)).catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }
    useEffect(() => {
        fetchBacklogs();
    }, [projectIndex, projects, nameFilterDebounce, offset, ascStoryPoint, ascPriority])
    return (
        <Box
            sx={{
                p: 3,
                m: 2,
                bgcolor: '#fff',
                border: '1px solid #edebe9', // Azure-style outline color
                borderRadius: 2, // Rounded corners
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Available product backlogs
                </Typography>

                {/* Filter & Sort Controls */}
                <Stack direction="row" spacing={2} alignItems="center">
                    {/* Search by Name */}
                    <TextField
                        placeholder="Filter by name..."
                        size="small"
                        variant="outlined"
                        onChange={(ev) => setNameFilter(ev.target.value)}
                        InputProps={{
                            startAdornment: <Search sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />,
                            sx: { bgcolor: '#fff', fontSize: '0.85rem' }
                        }}
                        sx={{ width: 250 }}
                    />

                    {/* Sort By Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="sort-label">Sort By</InputLabel>
                        <Select
                            labelId="sort-label"
                            label="Sort By"
                            defaultValue=""
                            sx={{ bgcolor: '#fff', fontSize: '0.85rem' }}
                        >
                            <MenuItem onClick={() => { setAscPriority(false); setAscStoryPoint(null) }} value="p_asc">Priority: Low to High</MenuItem>
                            <MenuItem onClick={() => { setAscPriority(true); setAscStoryPoint(null) }} value="p_desc">Priority: High to Low</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { setAscPriority(null); setAscStoryPoint(true) }} value="sp_asc">Story Points: Low to High</MenuItem>
                            <MenuItem onClick={() => { setAscPriority(null); setAscStoryPoint(false) }} value="sp_desc">Story Points: High to Low</MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { setAscPriority(null); setAscStoryPoint(null) }} value="clear">Clear</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </Stack>

            <Grid container spacing={2}>
                {productBacklogs.map((item) => {
                    const pStyle = getPriorityStyles(item.priority);

                    return (
                        <Grid size={3} key={item.id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    display: 'flex', // Enable flex to allow the button to sit next to content
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    WebkitUserDrag: 'none',
                                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                                    transition: 'box-shadow 0.2s',
                                    height: '100%' // Ensures uniform height if used in a grid
                                }}
                            >
                                {/* Left Side: Content */}
                                <CardContent sx={{ p: 2, flexGrow: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                                            {item.name}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <FiberManualRecord sx={{ fontSize: 10, color: pStyle.color }} />
                                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                                P{item.priority}
                                            </Typography>
                                        </Stack>

                                        <Chip
                                            label={`${item.story_point} SP`}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.65rem',
                                                bgcolor: '#f3f2f1',
                                                fontWeight: 700
                                            }}
                                        />
                                    </Stack>
                                </CardContent>

                                <Button
                                    variant="text"
                                    onClick={() => {
                                        createSprintBacklogHandler(item.id, sprint_id).then(() => fetchBacklogs())
                                    }}
                                    sx={{
                                        minWidth: '40px',
                                        p: 0,
                                        borderRadius: 0,
                                        borderLeft: '1px solid #edebe9',
                                        color: 'text.secondary',
                                        '&:hover': {
                                            bgcolor: '#f3f2f1',
                                            color: '#0078d4'
                                        }
                                    }}
                                >
                                    <ArrowUpward sx={{ fontSize: 18 }} />
                                </Button>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <Divider sx={{ my: 3 }} /> {/* Separator for the navigation row */}
            <Stack
                direction="row"
                justifyContent="flex-end" // Aligned to the right
                alignItems="center"
                spacing={1}
            >
                <Typography variant="caption" sx={{ color: 'text.secondary', mr: 2 }}>
                    {/* Showing 1-4 of 12 items */}
                </Typography>

                <Button
                    size="small"
                    variant="outlined" // Using outlines for navigation buttons
                    onClick={() => setOffset(offset - 1)}
                    sx={{ border: '1px solid #edebe9', borderRadius: 1 }}
                    disabled={offset <= 0}
                >
                    <ChevronLeft fontSize="small" />
                </Button>

                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setOffset(offset + 1)}
                    disabled={productBacklogs.length < 20}
                    sx={{ border: '1px solid #edebe9', borderRadius: 1, color: '#0078d4' }}
                >
                    <ChevronRight fontSize="small" />
                </Button>
            </Stack>
        </Box>
    );
};