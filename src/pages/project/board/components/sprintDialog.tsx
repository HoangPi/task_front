import { useEffect, useMemo, useState } from 'react';
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
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Close, Save, ExitToApp, Person, Search, Add } from '@mui/icons-material';
import { service } from '../../../../service';
import type { Backlog } from './sprintCard';

type User = {
    name: string;
    id: number;
    email: string;
};

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


const mockUsers: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice.j@dev.com" },
    { id: 2, name: "Bob Smith", email: "bob.smith@dev.com" },
    { id: 3, name: "Charlie Davis", email: "charlie.d@dev.com" },
];

export const WorkItemDialog = ({ open, handleClose, backlog }: { open: boolean, handleClose: any, backlog: Backlog }) => {
    // --- States ---
    const [status, setStatus] = useState(backlog.status);
    const [description, setDescription] = useState(backlog.notes || "");
    const [name, setName] = useState(backlog.backlog_name);
    const [tasks, setTasks] = useState<Task[]>([])

    // Search Popover States
    const [searchAnchor, setSearchAnchor] = useState<HTMLButtonElement | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // --- Logic ---
    const handleOwnerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setSearchAnchor(event.currentTarget);
    };

    useEffect(() => {
        if (open) {
            service.projectService.getTaskBySprintBacklogId(backlog.id)
                .then(res => setTasks(res)).catch(e => console.log(e))
        }
    }, [open])

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return [];
        return mockUsers
            .filter(u => u.email.toLowerCase().includes(searchQuery.toLowerCase()))
            .slice(0, 2); // Get first 2 similar records
    }, [searchQuery]);
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
                            SPRINT NAME
                        </Typography>
                    </Grid>

                    {/* METADATA ROW: size 12 parent */}
                    <Grid size={12}>
                        <Grid container spacing={2} alignItems="flex-start">

                            {/* [Owner Button & Email] size 4 */}
                            <Grid size={4}>
                                <Stack spacing={1}>
                                    <Button
                                        onClick={handleOwnerClick}
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
                                        {backlog.owner_name}
                                    </Button>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', pl: 1 }}>
                                        {backlog.email}
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
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>
                            Tasks
                        </Typography>
                        <Paper variant="outlined" sx={{ borderRadius: 1 }}>
                            {tasks.map((task: Task, index: number) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        p: 1,
                                        borderBottom: '1px solid #edebe9',
                                        '&:last-child': { borderBottom: 0 },
                                        bgcolor: index % 2 === 0 ? 'transparent' : '#faf9f8' // Subtle alternating rows
                                    }}
                                >
                                    <Grid container spacing={1} alignItems="center">
                                        {/* [finished] size 1 */}
                                        <Grid size={1}>
                                            <Checkbox
                                                checked={task.finished}
                                                size="small"
                                                onChange={(e) => {/* Handle toggle logic */ }}
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
                                                        textDecoration: task.finished ? 'line-through' : 'none',
                                                        color: task.finished ? 'text.disabled' : 'text.primary'
                                                    }
                                                }}
                                                onChange={(e) => {/* Handle task name change logic */ }}
                                            />
                                        </Grid>

                                        {/* [[owner_name size 12, owner_email size 12]] size 4 */}
                                        <Grid size={4}>
                                            <Grid container>
                                                <Grid size={12}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Person fontSize="small" />}
                                                        fullWidth
                                                        onClick={(e) => handleOwnerClick(e)} // Using your search popover logic
                                                        sx={{
                                                            justifyContent: 'flex-start',
                                                            textTransform: 'none',
                                                            borderColor: '#edebe9',
                                                            color: '#323130',
                                                            fontSize: '0.7rem',
                                                            py: 0.1,
                                                            minHeight: '28px'
                                                        }}
                                                    >
                                                        {task.owner_name || "Unassigned"}
                                                    </Button>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', pl: 1, fontSize: '0.6rem' }}>
                                                        {task.owner_email || "no-email"}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
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
                                                onChange={(e) => {/* Handle SP change logic */ }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Paper>
                        <Button
                            fullWidth
                            startIcon={<Add />}
                            onClick={() => {/* Add logic to push a new object to the tasks array */ }}
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
                    onClose={() => setSearchAnchor(null)}
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
                                        // Logic to update owner would go here
                                        setSearchAnchor(null);
                                    }}>
                                        <ListItemText
                                            primary={user.name}
                                            secondary={user.email}
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