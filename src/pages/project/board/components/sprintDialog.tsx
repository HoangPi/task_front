import { useState } from 'react';
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
    Checkbox,
    FormControlLabel,
    Paper
} from '@mui/material';
import { Close, Save, ExitToApp, Person } from '@mui/icons-material';

export const WorkItemDialog = ({ open, handleClose, backlog }: { open: boolean, handleClose: any, backlog: any }) => {
    // Local state for editability
    const [status, setStatus] = useState(backlog.status);
    const [description, setDescription] = useState(backlog.notes || "");
    const [name, setName] = useState(backlog.backlog_name);

    // Hardcoded Task Data
    const mockTasks = [
        { id: 1, name: "Setup project structure", story_point: 1, is_finished: true },
        { id: 2, name: "Configure OAuth2 provider", story_point: 3, is_finished: false },
        { id: 3, name: "Create login redirect logic", story_point: 2, is_finished: false },
    ];

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

                    {/* [Tasks list (hardcoded)] size 12 */}
                    <Grid size={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Tasks</Typography>
                        <Paper variant="outlined" sx={{ borderRadius: 1 }}>
                            {mockTasks.map((task) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1,
                                        borderBottom: '1px solid #edebe9',
                                        '&:last-child': { borderBottom: 0 }
                                    }}
                                >
                                    <FormControlLabel
                                        control={<Checkbox checked={task.is_finished} size="small" />}
                                        label={
                                            <Typography variant="body2" sx={{ textDecoration: task.is_finished ? 'line-through' : 'none' }}>
                                                {task.name}
                                            </Typography>
                                        }
                                        sx={{ flexGrow: 1 }}
                                    />
                                    <Typography variant="caption" sx={{ bgcolor: '#f3f2f1', px: 1, borderRadius: 5, fontWeight: 700 }}>
                                        {task.story_point} SP
                                    </Typography>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                </Grid>
            </DialogContent>
        </Dialog>
    );
};