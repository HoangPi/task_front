import { useContext, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Chip,
    Button,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    Stack,
    Avatar,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Popover,
    Grid,
    IconButton,
    CardContent,
    Card,
    FormControl,
    Select,
    InputLabel,
    TextField
} from '@mui/material';
import {
    NavigateNext as NavigateNextIcon,
    KeyboardArrowDown as ArrowDown,
    Add as AddIcon,
    Check,
    CalendarMonth,
    ArrowRightAlt,
    ChevronLeft,
    ChevronRight,
    Star,
    FiberManualRecord,
    ArrowUpward,
    Search
} from '@mui/icons-material';
import type { Sprint } from '../../../redux/storage/sprint';
import { useAppSelector } from '../../../redux/hook';
import { service } from '../../../service';
import { SelectedIndexContext } from '../selectItemContext';
import { ToastContext } from '../../../components/toast/messageContetx';
import { ToastType } from '../../../components/toast/notification';
import { type Backlog } from '../board/components/sprintCard';
import useDebounce from '../../../hooks/use-debounce';
import type { ProductBacklog } from '../../../service/project/projectService';

const CURRENT_DATE = new Date()
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MonthYearPickerPopover = ({ anchor, onClose, date, onYearChange, onMonthSelect }: any) => (
    <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { p: 2, width: 250 } }}
    >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <IconButton size="small" onClick={() => onYearChange(-1)}><ChevronLeft /></IconButton>
            <Typography sx={{ fontWeight: 700 }}>{date.year}</Typography>
            <IconButton size="small" onClick={() => onYearChange(1)}><ChevronRight /></IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={1}>
            {months.map((m, i) => (
                <Grid size={4} key={m}>
                    <Button
                        fullWidth
                        size="small"
                        variant={date.month === i ? "contained" : "text"}
                        onClick={() => onMonthSelect(i)}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                    >
                        {m}
                    </Button>
                </Grid>
            ))}
        </Grid>
    </Popover>
);

export const SprintHeader = () => {
    const [sprints, setSprints] = useState<Sprint[]>()
    const projects = useAppSelector(state => state.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext)
    const [chosenSprint, setChosenSprint] = useState<Sprint | null>(null)
    const [currentSprint, setCurrentSprint] = useState<Sprint | null>(null)
    const toastContext = useContext(ToastContext)

    const [fromDate, setFromDate] = useState({ month: CURRENT_DATE.getMonth(), year: CURRENT_DATE.getFullYear() }); // March (Index 2)
    const [toDate, setToDate] = useState({ month: CURRENT_DATE.getMonth(), year: CURRENT_DATE.getFullYear() });   // May (Index 4)

    // Anchor states for the two pickers and sprint picker
    const [anchorFrom, setAnchorFrom] = useState<HTMLButtonElement | null>(null);
    const [anchorTo, setAnchorTo] = useState<HTMLButtonElement | null>(null);
    const [sprintMenuAnchor, setSprintMenuAnchor] = useState<null | HTMLElement>(null);

    // --- Handlers ---
    const handleYearChange = (type: 'from' | 'to', delta: number) => {
        if (type === 'from') setFromDate(prev => ({ ...prev, year: prev.year + delta }));
        else setToDate(prev => ({ ...prev, year: prev.year + delta }));
    };
    const handleMonthSelect = (type: 'from' | 'to', monthIndex: number) => {
        if (type === 'from') {
            setFromDate(prev => ({ ...prev, month: monthIndex }));
            setAnchorFrom(null);
        } else {
            setToDate(prev => ({ ...prev, month: monthIndex }));
            setAnchorTo(null);
        }
    };
    const handleCreateSprintBacklog = (backlogId: number, sprint_id: number) => {
        return service.projectService.createSprintBacklog(backlogId, sprint_id)
            .then(() => fetchSprints())
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }
    const fetchSprints = async () => {
        try {

            const projectId = projects[projectIndex.value].id
            const result = await service.projectService.getCurrentSprint(projectId)
            if (result.length >= 1) {
                if (!chosenSprint)
                    setChosenSprint(result[0])
                setCurrentSprint(result[0])
            }
            else {
                setCurrentSprint(null)
                setChosenSprint(null)
            }
            const start = `${fromDate.year}-${fromDate.month + 1}-01`
            const endDate = new Date(toDate.year, toDate.month + 1, 1)
            endDate.setDate(endDate.getDate() - 1)
            const maxDayOfMonth = endDate.getDate()
            const end = `${toDate.year}-${toDate.month + 1}-${maxDayOfMonth}`
            const otherSprints = await service.projectService.getSprintsByRange(projectId, start, end)
            setSprints(otherSprints)
        }
        catch (e) {
            toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR });
        }
    }
    useEffect(() => {
        fetchSprints()
    }, [fromDate, toDate])

    if (!chosenSprint)
        return <>No Sprint recently</>

    return (
        <Box sx={{ p: 2, borderBottom: '1px solid #edebe9' }}>
            {/* ROW 1: Date Picker Range */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mr: 1 }}>
                    RANGE:
                </Typography>

                {/* FROM Button */}
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CalendarMonth fontSize="small" />}
                    onClick={(e) => setAnchorFrom(e.currentTarget)}
                    sx={{ textTransform: 'none', borderColor: '#edebe9', color: '#323130' }}
                >
                    {months[fromDate.month]} {fromDate.year}
                </Button>

                <ArrowRightAlt sx={{ color: 'text.disabled' }} />

                {/* TO Button */}
                <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => setAnchorTo(e.currentTarget)}
                    sx={{ textTransform: 'none', borderColor: '#edebe9', color: '#323130' }}
                >
                    {months[toDate.month]} {toDate.year}
                </Button>
            </Stack>

            {/* ROW 2: Sprint Name & Breadcrumbs */}
            <Stack direction="row" alignItems="center" spacing={2}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
                    <Link underline="hover" color="inherit" href="#" sx={{ fontSize: '0.9rem' }}>Sprint</Link>

                    <Box>
                        <Button
                            onClick={(e) => setSprintMenuAnchor(e.currentTarget)}
                            endIcon={<ArrowDown />}
                            sx={{ textTransform: 'none', color: '#0078d4', fontWeight: 800, fontSize: '1.2rem', p: 0.5 }}
                        >
                            {chosenSprint.name}
                        </Button>


                        <Menu
                            anchorEl={sprintMenuAnchor}
                            open={Boolean(sprintMenuAnchor)}
                            onClose={() => setSprintMenuAnchor(null)}
                            PaperProps={{ sx: { minWidth: 240, mt: 1, boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' } }}
                        >
                            {/* 1. All other sprints */}
                            {sprints && sprints.map((sprint) => (
                                <MenuItem key={sprint.id} onClick={() => { setChosenSprint(sprint); setSprintMenuAnchor(null); }} selected={sprint.id === chosenSprint.id}>
                                    <ListItemIcon>{sprint.id === chosenSprint.id && <Check fontSize="small" />}</ListItemIcon>
                                    <ListItemText primary={sprint.name} secondary={
                                        `${sprint.start_date.split("-").reverse().join("/")} - ${sprint.end_date.split("-").reverse().join("/")} (${sprint.status.split("_").join(" ")})`
                                    } />
                                </MenuItem>
                            ))}

                            <Divider />

                            {/* 2. CURRENT SPRINT (Pinned right above Add) */}
                            {currentSprint && (
                                <MenuItem
                                    onClick={() => { setChosenSprint(currentSprint); setSprintMenuAnchor(null); }}
                                    selected={currentSprint?.id === chosenSprint.id}
                                    sx={{ bgcolor: '#fff8e1' }} // Subtle gold tint to indicate "Current"
                                >
                                    <ListItemIcon>
                                        {currentSprint?.id === chosenSprint.id ? <Check fontSize="small" /> : <Star fontSize="small" sx={{ color: '#ffb900' }} />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={currentSprint.name}
                                        secondary="Current Sprint"
                                        primaryTypographyProps={{ fontWeight: 700 }}
                                        secondaryTypographyProps={{ sx: { color: '#d89801', fontSize: '0.65rem', fontWeight: 700 } }}
                                    />
                                </MenuItem>
                            )}

                            {/* 3. ADD BUTTON (Bottom) */}
                            <MenuItem onClick={() => setSprintMenuAnchor(null)} sx={{ color: '#0078d4' }}>
                                <ListItemIcon><AddIcon fontSize="small" sx={{ color: '#0078d4' }} /></ListItemIcon>
                                <ListItemText primary="New Sprint" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                            </MenuItem>
                        </Menu>
                    </Box>
                </Breadcrumbs>
                <Box
                    sx={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: '#eff6fc',
                        px: 1,
                        py: 0.3,
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        height: 'fit-content',
                        lineHeight: 1
                    }}
                >
                    {chosenSprint && new Date(chosenSprint.end_date) < CURRENT_DATE
                        ? 'past'
                        : new Date(chosenSprint.start_date) > CURRENT_DATE
                            ? 'future' : 'current'}
                </Box>
            </Stack>

            {/* --- MONTH YEAR POPOVER (Re-usable for both) --- */}
            <MonthYearPickerPopover
                anchor={anchorFrom}
                onClose={() => setAnchorFrom(null)}
                date={fromDate}
                onYearChange={(d: number) => handleYearChange('from', d)}
                onMonthSelect={(m: number) => handleMonthSelect('from', m)}
            />

            <MonthYearPickerPopover
                anchor={anchorTo}
                onClose={() => setAnchorTo(null)}
                date={toDate}
                onYearChange={(d: number) => handleYearChange('to', d)}
                onMonthSelect={(m: number) => handleMonthSelect('to', m)}
            />
            <SprintPage sprint={chosenSprint} createSprintBacklogHandler={handleCreateSprintBacklog} />
        </Box>
    );
};

export const SprintPage = ({ sprint, createSprintBacklogHandler }: { sprint: Sprint, createSprintBacklogHandler: (backlogId: number, sprint_id: number) => Promise<void | undefined> }) => {
    const [backlogs, setBacklogs] = useState<Backlog[]>([])
    const toastContext = useContext(ToastContext)
    useEffect(() => {
        service.projectService.getSprintBacklogBySprintId(sprint.id)
            .then(result => setBacklogs(result))
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }, [sprint])
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
            <ProductBacklogList sprint_id={sprint.id} createSprintBacklogHandler={createSprintBacklogHandler} />
        </Box>
    );
};

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
                    Work Items
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
                    Showing 1-4 of 12 items
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