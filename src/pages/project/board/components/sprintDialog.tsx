import { useContext, useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    Typography,
    Stack,
    Box,
    IconButton,
    Divider,
    Grid,
    Button,
    TextField,
    MenuItem,
    Select,
    Popover,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Checkbox
} from '@mui/material';
import { Close, Save, ExitToApp, Person, Search, Add, Task, RestoreFromTrash, DeleteOutline, Restore } from '@mui/icons-material';
import { service } from '../../../../service';
import type { Backlog } from './sprintCard';
import useDebounce from '../../../../hooks/use-debounce';
import { useAppSelector } from '../../../../redux/hook';
import { SelectedIndexContext } from '../../selectItemContext';
import type { UserSimpleInfo } from '../../../../service/project/projectService';

export type Task = {
    id: number;
    user_id: number | null;
    sprint_back_log_id: number;
    story_point: number;
    finished: boolean;
    name: string;
    owner_name: string | null,
    owner_email: string | null
};

interface LocalTask extends Task {
    state: 'origin' | 'updated' | 'new' | 'deleted'
}

interface UserUpdateLocation {
    type: 'backlog' | 'task',
    index?: number
}

const getStateStyles = (state: string): { border: string, bgcolor?: string, borderBottom?: string, opacity?: number } => {
    switch (state) {
        case 'new': return { border: '1px solid #28a745', bgcolor: '#f0fff4' }; // Green
        case 'updated': return { border: '1px solid #004896', bgcolor: '#fffaf5' }; // Brown
        case 'deleted': return { border: '1px solid #d73a49', bgcolor: '#ffdce0', opacity: 0.7 }; // Red
        default: return { border: '1px solid transparent', borderBottom: '1px solid #edebe9' }; // Origin
    }
};

const nullUser: UserSimpleInfo = {
    id: null,
    name: null,
    email: null
}

export const WorkItemDialog = ({ open, handleClose, backlog }: { open: boolean, handleClose: any, backlog: Backlog }) => {
    // --- States ---
    const [status, setStatus] = useState(backlog.status);
    const [description, setDescription] = useState(backlog.notes || "");
    const [name, setName] = useState(backlog.backlog_name);
    const [backlogOwner, setBacklogOwner] = useState<UserSimpleInfo>({
        id: backlog.task_owner,
        name: backlog.owner_name,
        email: backlog.email
    })
    const [tasks, setTasks] = useState<LocalTask[]>([])
    const [originalTasks, setOriginalTask] = useState<Task[]>([])
    const [updateType, setUpdateType] = useState<UserUpdateLocation>({ type: "backlog" })
    const projectIndex = useContext(SelectedIndexContext)
    const projectId = useAppSelector(s => s.projectStorage.projects[projectIndex.value].id)
    function evaluateStateChange() {
        setTasks((tasksState) => {
            return tasksState.map((item) => {
                if (item.state === 'new' || item.state === 'deleted') {
                    return item;
                }
                const origin = originalTasks.find(o => o.id === item.id);
                if (!origin) {
                    throw `Where did you get this key ${item.id}`;
                }
                const unchanged = origin.finished === item.finished
                    && origin.name === item.name
                    && origin.user_id === item.user_id
                    && origin.story_point === item.story_point
                return {
                    ...item,
                    state: unchanged ? 'origin' : 'updated'
                };
            });
        });
    }

    // Search Popover States
    const [searchAnchor, setSearchAnchor] = useState<HTMLButtonElement | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<UserSimpleInfo[]>([])
    const debounceSearchQuery = useDebounce(searchQuery, 500)
    // --- Logic ---
    const handleOwnerClick = (event: React.MouseEvent<HTMLButtonElement>, type: UserUpdateLocation) => {
        setUpdateType(type)
        setSearchAnchor(event.currentTarget);
    };

    useEffect(() => {
        if (open) {
            setBacklogOwner({ id: backlog.task_owner, name: backlog.owner_name, email: backlog.email })
            setStatus(backlog.status)
            setDescription(backlog.notes)
            service.projectService.getTaskBySprintBacklogId(backlog.id)
                .then(res => {
                    setOriginalTask(res)
                    setTasks(res.map(task => ({ ...task, state: 'origin' })))
                }).catch(e => console.log(e))
        }
    }, [open])

    useEffect(() => {
        service.projectService.getUserByProjectIdAndEmail(projectId, debounceSearchQuery)
            .then(result => setFilteredUsers([nullUser, ...result]))
    }, [debounceSearchQuery])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { height: '90vh', borderRadius: 2 } }}
        >
            {/* Top Header with Close */}
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={handleClose}><Close /></IconButton>
            </Box>

            <DialogContent sx={{ px: 4, pt: 0 }}>
                <Grid container spacing={3}>

                    {/* [backlog_name] size 12 */}
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Work Item Title"
                            InputProps={{
                                disableUnderline: true,
                                sx: { fontSize: '1.5rem', fontWeight: 800, color: '#0078d4' }
                            }}
                        />
                    </Grid>

                    {/* [sprint_name (hardcode)] size 12 */}
                    <Grid size={12} sx={{ mt: -2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            {backlog.backlog_name}
                        </Typography>
                    </Grid>

                    {/* METADATA ROW: size 12 parent */}
                    <Grid size={12}>
                        <Grid container spacing={2} alignItems="flex-start">

                            {/* [Owner Button & Email] size 4 */}
                            <Grid size={4}>
                                <Stack spacing={1}>
                                    <Button
                                        onClick={(ev) => handleOwnerClick(ev, { type: "backlog" })}
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Person fontSize="small" />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            textTransform: 'none',
                                            borderColor: '#edebe9',
                                            color: '#323130'
                                        }}
                                    >
                                        {backlogOwner.name}
                                    </Button>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', pl: 1 }}>
                                        {backlogOwner.email}
                                    </Typography>
                                </Stack>
                            </Grid>

                            {/* [Status Dropdown] size 4 */}
                            <Grid size={4}>
                                <Select
                                    fullWidth
                                    size="small"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    sx={{ bgcolor: '#f3f2f1' }}
                                >
                                    <MenuItem value="created">Created</MenuItem>
                                    <MenuItem value="on_going">Active</MenuItem>
                                    <MenuItem value="in_review">Waiting Review</MenuItem>
                                    <MenuItem value="finished">Completed</MenuItem>
                                    <MenuItem value="failed">Failed</MenuItem>
                                </Select>
                            </Grid>

                            {/* [Action Buttons] size 4 */}
                            <Grid size={4}>
                                <Grid container spacing={1}>
                                    <Grid size={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="small"
                                            startIcon={<Save />}
                                            sx={{ bgcolor: '#0078d4', textTransform: 'none' }}
                                        >
                                            Save
                                        </Button>
                                    </Grid>
                                    <Grid size={12}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            startIcon={<ExitToApp />}
                                            sx={{ textTransform: 'none' }}
                                            onClick={handleClose}
                                        >
                                            Save and Exit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid size={12}><Divider /></Grid>

                    {/* [description (editable)] size 12 */}
                    <Grid size={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Description</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            variant="outlined"
                            placeholder="Add a detailed description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ bgcolor: '#faf9f8' }}
                        />
                    </Grid>

                    <Grid size={12}>
                        <Grid container alignItems="center" sx={{ mb: 1 }}>
                            <Grid size={10}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                    Tasks
                                </Typography>
                            </Grid>

                            {/* [Undo Button] size 2 aligned right */}
                            <Grid size={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    startIcon={<Restore />}
                                    onClick={() => { setTasks(() => originalTasks.map(item => ({ ...item, state: 'origin' }))) }}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '0.75rem',
                                        color: 'text.secondary',
                                        '&:hover': { color: '#0078d4' }
                                    }}
                                >
                                    Undo All
                                </Button>
                            </Grid>
                        </Grid>
                        <Paper variant="outlined" sx={{ borderRadius: 1 }}>
                            {tasks.map((task: LocalTask, index: number) => {
                                const style = getStateStyles(task.state);
                                return (
                                    <Box
                                        key={task.id}
                                        sx={{
                                            p: 1,
                                            transition: 'all 0.2s ease',
                                            ...style,
                                            '&:last-child': { borderBottom: task.state === 'origin' ? 0 : style.border }
                                        }}
                                    >
                                        <Grid container spacing={1} alignItems="center">
                                            {/* [finished] size 1 */}
                                            <Grid size={1}>
                                                <Checkbox
                                                    checked={task.finished}
                                                    size="small"
                                                    onChange={() => {
                                                        const t = tasks.find(item => item.id === task.id)
                                                        if (!t) {
                                                            return
                                                        }
                                                        setTasks((tasksState) =>
                                                            tasksState.map(
                                                                item => item.id !== task.id ? item : { ...task, finished: !t.finished }
                                                            )
                                                        )
                                                        evaluateStateChange();
                                                    }}
                                                />
                                            </Grid>

                                            {/* [task_name] size 5 - Now Editable */}
                                            <Grid size={5}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    variant="standard"
                                                    value={task.name}
                                                    placeholder="Task name"
                                                    InputProps={{
                                                        disableUnderline: true,
                                                        sx: {
                                                            fontSize: '0.85rem',
                                                            color: task.finished ? 'text.primary' : 'text.disabled'
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        setTasks(
                                                            (tasksState) => {
                                                                tasksState[index].name = e.target.value
                                                                return tasksState
                                                            })
                                                        evaluateStateChange()
                                                    }}
                                                />
                                            </Grid>

                                            {/* [[owner_name size 12, owner_email size 12]] size 4 */}
                                            <Grid size={3}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Person fontSize="small" />}
                                                    fullWidth
                                                    disabled={task.state === 'deleted'}
                                                    onClick={(e) => handleOwnerClick(e, { type: "task", index: index })}
                                                    sx={{
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        borderColor: '#edebe9',
                                                        color: '#323130',
                                                        py: 0.5, // Slightly more padding to breathe with two lines
                                                        minHeight: '40px', // Increased height to accommodate two lines
                                                        px: 1,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <Stack alignItems="flex-start" sx={{ overflow: 'hidden', width: '100%' }}>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                fontWeight: 700,
                                                                lineHeight: 1.2,
                                                                fontSize: '0.7rem',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                        >
                                                            {task.owner_name || "Unassigned"}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: 'text.disabled',
                                                                fontSize: '0.6rem',
                                                                lineHeight: 1.1,
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                width: '100%',
                                                                textAlign: 'left'
                                                            }}
                                                        >
                                                            {task.owner_email || "no-email"}
                                                        </Typography>
                                                    </Stack>
                                                </Button>
                                            </Grid>

                                            {/* [story_point] size 2 - Now Editable */}
                                            <Grid size={2}>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    variant="outlined"
                                                    value={task.story_point}
                                                    placeholder="0"
                                                    InputProps={{
                                                        sx: {
                                                            fontSize: '0.75rem',
                                                            height: '28px',
                                                            fontWeight: 700,
                                                            bgcolor: '#f3f2f1',
                                                            '& fieldset': { border: 'none' }
                                                        }
                                                    }}
                                                    inputProps={{ style: { textAlign: 'center', padding: '4px' } }}
                                                    onChange={(e) => {
                                                        setTasks((tasksState) => {
                                                            const point = Number(e.target.value)
                                                            tasksState[index].story_point = point >= 0 ? point : 0
                                                            return tasksState
                                                        })
                                                        evaluateStateChange()
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={1} sx={{ textAlign: 'right' }}>
                                                <IconButton
                                                    size="small"
                                                    color={task.state === 'deleted' ? "primary" : "error"}
                                                    onClick={() => {
                                                        if (task.state === 'new') {
                                                            setTasks((tasksState) => tasksState.filter((item) => item.id !== task.id))
                                                            return
                                                        }
                                                        setTasks(tasksState => {
                                                            tasksState[index].state = task.state === 'deleted' ? 'updated' : 'deleted'
                                                            return tasksState
                                                        })
                                                        evaluateStateChange()
                                                    }}
                                                >
                                                    {task.state === 'deleted' ? <RestoreFromTrash fontSize="small" /> : <DeleteOutline fontSize="small" />}
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )
                            })}
                        </Paper>
                        <Button
                            fullWidth
                            startIcon={<Add />}
                            onClick={() => {
                                const id = tasks.reduce((prev, current) => current.id < prev.id ? current : prev, tasks[0]).id - 1
                                setTasks((tasks => [...tasks, {
                                    id: id,
                                    user_id: null,
                                    sprint_back_log_id: backlog.sprint_id,
                                    story_point: 1,
                                    finished: false,
                                    name: "",
                                    owner_name: null,
                                    owner_email: null,
                                    state: 'new'
                                }]))
                            }}
                            sx={{
                                mt: 1,
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                color: '#0078d4',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                '&:hover': { bgcolor: '#ebf3fc' }
                            }}
                        >
                            Add task
                        </Button>
                    </Grid>

                </Grid>
                <Popover
                    open={Boolean(searchAnchor)}
                    anchorEl={searchAnchor}
                    onClose={() => {
                        setSearchAnchor(null)
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    PaperProps={{ sx: { width: 300, p: 1, mt: 1, borderRadius: 2 } }}
                >
                    <TextField
                        autoFocus
                        fullWidth
                        size="small"
                        placeholder="Search by email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
                        sx={{ mb: 1 }}
                    />
                    <List sx={{ pt: 0 }}>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <ListItem disablePadding key={user.id}>
                                    <ListItemButton onClick={() => {
                                        if (updateType.type === "backlog") {
                                            setBacklogOwner(user)
                                            setSearchAnchor(null)
                                            return
                                        }
                                        if (updateType.index === undefined || updateType.index === null) {
                                            setSearchAnchor(null)
                                            return
                                        }
                                        const index = updateType.index
                                        setTasks(tasksState => {
                                            tasksState[index].user_id = user.id
                                            tasksState[index].owner_email = user.email
                                            tasksState[index].owner_name = user.name
                                            return tasksState
                                        })
                                        evaluateStateChange()
                                        setSearchAnchor(null);
                                    }}>
                                        <ListItemText
                                            primary={user.name || "Unassigned"}
                                            secondary={user.email || "Unassigned"}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                            secondaryTypographyProps={{ variant: 'caption' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="caption" sx={{ p: 2, display: 'block', textAlign: 'center', color: 'text.disabled' }}>
                                {searchQuery ? "No matches found" : "Type to search users..."}
                            </Typography>
                        )}
                    </List>
                </Popover>
            </DialogContent>
        </Dialog>
    );
};