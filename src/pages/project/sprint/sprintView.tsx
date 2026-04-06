import { useContext, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Breadcrumbs,
    Link,
    Button,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    Stack,
    Popover,
    Grid,
    IconButton
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
    Star
} from '@mui/icons-material';
import type { Sprint } from '../../../redux/storage/sprint';
import { useAppSelector } from '../../../redux/hook';
import { service } from '../../../service';
import { SelectedIndexContext } from '../selectItemContext';
import { ToastContext } from '../../../components/toast/messageContetx';
import { ToastType } from '../../../components/toast/notification';
import { SprintPage } from './sprintBody';
import { CreateSprintDialog } from './createSprintDialog';

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
    const [open, setOpen] = useState(false)
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
            if (chosenSprint) {
                return;
            }
            if (result.length >= 0) {
                setChosenSprint(result[0])
            }
            else if (otherSprints.length >= 0) {
                setChosenSprint(otherSprints[otherSprints.length - 1])
            }
            else {
                setChosenSprint(null)
            }
        }
        catch (e) {
            toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR });
        }
    }
    useEffect(() => {
        if (open) {
            return
        }
        fetchSprints()
    }, [fromDate, toDate, projectIndex.value, open])

    return (
        <Box sx={{ p: 2, borderBottom: '1px solid #edebe9' }}>
            {/* ROW 1: Date Picker Range */}
            <Stack
                direction="row"
                justifyContent="space-between" // Pushes children to opposite ends
                alignItems="center"
                sx={{ mb: 1.5 }}
            >
                {/* LEFT ALIGNED: Date Range Group */}
                <Stack direction="row" alignItems="center" spacing={1}>
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

                {/* RIGHT ALIGNED: Create Sprint Button */}
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                        setOpen(true)
                    }}
                    sx={{
                        bgcolor: '#0078d4',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                    }}
                >
                    Create New Sprint
                </Button>
            </Stack>

            {/* ROW 2: Sprint Name & Breadcrumbs */}
            {chosenSprint ?
                <>
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
                    <SprintPage sprint={chosenSprint} createSprintBacklogHandler={handleCreateSprintBacklog} />
                </> : <>No sprints recently</>
            }

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
            <CreateSprintDialog open={open} onClose={() => { setOpen(false) }} />
        </Box>
    );
};

