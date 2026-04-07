import { Search, FiberManualRecord, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Divider, Grid, Card, CardContent, Chip, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { ToastContext } from "../../../components/toast/messageContetx";
import { ToastType } from "../../../components/toast/notification";
import useDebounce from "../../../hooks/use-debounce";
import { useAppSelector } from "../../../redux/hook";
import { service } from "../../../service";
import type { ProductBacklog } from "../../../service/project/projectService";
import { SelectedIndexContext } from "../selectItemContext";
import { LoadingState } from "../../../components/loadingComponent";

const getPriorityStyles = (priority: number) => {
    switch (priority) {
        case 1: return { color: '#d83b01', label: 'High' }; // Red-Orange
        case 2: return { color: '#ffb900', label: 'Medium' }; // Yellow
        case 3: return { color: '#0078d4', label: 'Low' }; // Blue
        default: return { color: '#8a8886', label: 'None' };
    }
};

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'finished':
            return { bgcolor: '#dff6dd', color: '#107c10' }; // Green
        case 'on_going':
            return { bgcolor: '#fff4ce', color: '#967000' }; // Yellow/Gold
        case 'created':
            return { bgcolor: '#edebe9', color: '#323130' }; // Gray
        default:
            return { bgcolor: '#f3f2f1', color: '#605e5c' }; // Default Gray
    }
};

export const ProductBacklogPage = () => {
    const [open, setOpen] = useState(false)
    const [productBacklogs, setProductBacklogs] = useState<ProductBacklog[]>([])
    const [nameFilter, setNameFilter] = useState("")
    const nameFilterDebounce = useDebounce(nameFilter, 500)
    const [includeFinished, setIncludeFinished] = useState<boolean | null>(true)
    const [offset, setOffset] = useState(0)
    const [ascStoryPoint, setAscStoryPoint] = useState<boolean | null>(null)
    const [ascPriority, setAscPriority] = useState<boolean | null>(null)
    const [chosenBacklog, setChosenBacklog] = useState<ProductBacklog | null>(null)
    const projects = useAppSelector(state => state.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext);
    const toastContext = useContext(ToastContext)
    const [isFetching, setIsfetching] = useState(false)
    const fetchBacklogs = () => {
        if (open) {
            return
        }
        if (projects.length <= 0) {
            return
        }
        setIsfetching(true)
        service.projectService.getProductBacklogs(
            projects[projectIndex.value].id,
            offset,
            nameFilterDebounce,
            includeFinished,
            ascStoryPoint,
            ascPriority
        )
            .then(result => setProductBacklogs(result))
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
            .finally(() => setIsfetching(false))
    }
    useEffect(() => {
        fetchBacklogs();
    }, [projectIndex, projects, includeFinished, nameFilterDebounce, offset, ascStoryPoint, ascPriority, open])
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
                    Product backlogs
                </Typography>

                {/* Filter & Sort Controls */}
                <Stack direction="row" spacing={2} alignItems="center">

                    {/* 1. Search by Name */}
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

                    {/* 2. NEW: Hardcoded Filter Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="status-filter-label">Status</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            label="Status"
                            defaultValue=""
                            sx={{ bgcolor: '#fff', fontSize: '0.85rem' }}
                        >
                            <MenuItem onClick={() => setIncludeFinished(false)} value="created">Unfinished</MenuItem>
                            <MenuItem onClick={() => setIncludeFinished(null)} value="finished">Unassigned</MenuItem>
                            <MenuItem onClick={() => setIncludeFinished(true)} value="on_going">All</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 3. Sort By Dropdown */}
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
                {isFetching ? <LoadingState /> : productBacklogs.map((item) => {
                    const pStyle = getPriorityStyles(item.priority);

                    return (
                        <Grid size={3} key={item.id}>
                            <Card
                                onClick={() => {
                                    setChosenBacklog(item)
                                    setOpen(true)
                                }}
                                variant="outlined"
                                sx={{
                                    display: 'flex',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                    WebkitUserDrag: 'none',
                                    '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                                    transition: 'box-shadow 0.2s',
                                    height: '100%'
                                }}
                            >
                                {/* Left Side: Content */}
                                <CardContent sx={{ p: 2, flexGrow: 1 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                                            {item.name}
                                        </Typography>

                                        {/* Status Chip */}
                                        <Chip
                                            label={item.status.replace('_', ' ')}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                textTransform: 'capitalize',
                                                borderRadius: 1, // Slight square-ish Azure look
                                                ...getStatusStyles(item.status)
                                            }}
                                        />
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
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
            <Divider sx={{ my: 3 }} /> {/* Separator for the navigation row */}
            <Stack
                direction="row"
                justifyContent="space-between" // Changed from flex-end to distribute space between left and right groups
                alignItems="center"
                sx={{ mt: 2 }}
            >
                {/* LEFT ALIGNED: Add Button */}
                <Button
                    variant="contained"
                    onClick={() => {
                        setChosenBacklog(null);
                        setOpen(true);
                    }}
                    sx={{
                        bgcolor: '#0078d4',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                    }}
                >
                    Add product backlog
                </Button>

                {/* RIGHT ALIGNED: Pagination Group */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mr: 2 }}>
                        {/* Showing 1-4 of 12 items */}
                    </Typography>

                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setOffset(offset - 1)}
                        sx={{ border: '1px solid #edebe9', borderRadius: 1, minWidth: '40px' }}
                        disabled={offset <= 0}
                    >
                        <ChevronLeft fontSize="small" />
                    </Button>

                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setOffset(offset + 1)}
                        disabled={productBacklogs.length < 20}
                        sx={{ border: '1px solid #edebe9', borderRadius: 1, color: '#0078d4', minWidth: '40px' }}
                    >
                        <ChevronRight fontSize="small" />
                    </Button>
                </Stack>
            </Stack>
            <BacklogItemDialog backlog={chosenBacklog} open={open} onClose={() => setOpen(false)} />
        </Box>
    );
};

export const BacklogItemDialog: React.FC<{ open: boolean, onClose: any, backlog: ProductBacklog | null }> = ({ open, onClose, backlog }) => {
    // State for each property
    const [name, setName] = useState<string>("");
    const [acceptanceCriteria, setAcceptanceCriteria] = useState<string>("");
    const [priority, setPriority] = useState<number>(1);
    const [storyPoint, setStoryPoint] = useState<number>(1);
    const projects = useAppSelector(state => state.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext)
    const toastContext = useContext(ToastContext)

    useEffect(() => {
        if (open) {
            if (backlog) {
                setName(backlog.name)
                setAcceptanceCriteria(backlog.acceptance_criteria)
                setPriority(backlog.priority)
                setStoryPoint(backlog.story_point)
                return
            }
            setName('')
            setAcceptanceCriteria('')
            setPriority(1)
            setStoryPoint(1)
        }
    }, [open])

    const handleSave = async () => {
        try {
            if (!backlog) {
                await service.projectService.createProductBacklog({
                    project_id: projects[projectIndex.value].id,
                    name: name,
                    acceptance_criteria: acceptanceCriteria,
                    priority: priority,
                    story_point: storyPoint,
                    status: 'created', // Server doesn't read those but I don't want another type (status, id)
                    id: -1
                })
            }
            else {
                await service.projectService.updateProductBacklog({
                    project_id: projects[projectIndex.value].id,
                    name: name,
                    acceptance_criteria: acceptanceCriteria,
                    priority: priority,
                    story_point: storyPoint,
                    status: backlog.status,
                    id: backlog.id
                })
            }
        }
        catch (e) {
            toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR })
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #edebe9', pb: 1.5 }}>
                {backlog ? `Update product backlog #${backlog.id}` : "New product backlog"}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Stack spacing={3} sx={{ pt: 1 }}>
                    {/* Name */}
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                        required
                    />

                    {/* Acceptance Criteria */}
                    <TextField
                        label="Acceptance Criteria"
                        value={acceptanceCriteria}
                        onChange={(e) => setAcceptanceCriteria(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        size="small"
                        variant="outlined"
                        placeholder="Define the conditions for this item to be considered done..."
                    />

                    {/* Number Fields Container */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Priority */}
                        <TextField
                            label="Priority"
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                            size="small"
                            sx={{ width: '50%' }}
                            inputProps={{ min: 1 }} // Enforces > 0
                        />

                        {/* Story Point */}
                        <TextField
                            label="Story Points"
                            type="number"
                            value={storyPoint}
                            onChange={(e) => setStoryPoint(Number(e.target.value))}
                            size="small"
                            sx={{ width: '50%' }}
                            inputProps={{ min: 1 }} // Enforces > 0
                        />
                    </Box>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #edebe9' }}>
                <Button
                    onClick={onClose}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={!name || !name.trim()} // Prevent saving without a name
                    sx={{
                        bgcolor: '#0078d4',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#106ebe' }
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};