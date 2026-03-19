import React, { useContext, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Box
} from '@mui/material';
import { ToastContext } from '../../../components/toast/messageContetx';
import { ToastType } from '../../../components/toast/notification';
import { service } from '../../../service';
import { useAppSelector } from '../../../redux/hook';
import { SelectedIndexContext } from '../selectItemContext';

interface CreateSprintDialogProps {
    open: boolean;
    onClose: () => void;
    // onSave: (payload: any) => void; 
}

export const CreateSprintDialog: React.FC<CreateSprintDialogProps> = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const [goal, setGoal] = useState('');
    const [startDateConfig, setStartDateConfig] = useState<'current' | 'custom' | 'after_latest'>('current');
    const [customDate, setCustomDate] = useState('');
    const toastContext = useContext(ToastContext)
    const projects = useAppSelector(state => state.projectStorage.projects)
    const projectIndex = useContext(SelectedIndexContext).value

    const handleSave = async () => {
        try {
            if (startDateConfig !== 'after_latest') {
                let date = new Date();
                let start_date = customDate
                if (startDateConfig === 'current') {
                    start_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                }
                await service.projectService.createSprint(projects[projectIndex].id, name, goal, start_date)
            }
            else {
                await service.projectService.createSprint(projects[projectIndex].id, name, goal, "")
            }
        }
        catch (e) {
            toastContext?.dispatcher({message: String(e), type: ToastType.ERROR})
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #edebe9', pb: 1.5 }}>
                Create New Sprint
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Stack spacing={3} sx={{ pt: 1 }}>

                    {/* Sprint Name */}
                    <TextField
                        label="Sprint Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        size="small"
                        variant="outlined"
                        required
                    />

                    {/* Sprint Goal */}
                    <TextField
                        label="Sprint Goal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        variant="outlined"
                        placeholder="What is the main objective of this sprint?"
                    />

                    {/* Start Date Configuration */}
                    <FormControl>
                        <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1, fontSize: '0.85rem' }}>
                            Start Date Configuration
                        </FormLabel>
                        <RadioGroup
                            value={startDateConfig}
                            onChange={(e) => setStartDateConfig(e.target.value as any)}
                        >
                            <FormControlLabel
                                value="current"
                                control={<Radio size="small" />}
                                label="Current Date"
                                componentsProps={{ typography: { variant: 'body2' } }}
                            />
                            <FormControlLabel
                                value="after_latest"
                                control={<Radio size="small" />}
                                label="After the Latest Sprint"
                                componentsProps={{ typography: { variant: 'body2' } }}
                            />
                            <FormControlLabel
                                value="custom"
                                control={<Radio size="small" />}
                                label="Custom Date"
                                componentsProps={{ typography: { variant: 'body2' } }}
                            />
                        </RadioGroup>
                    </FormControl>

                    {/* Conditional Custom Date Picker */}
                    {startDateConfig === 'custom' && (
                        <Box sx={{ pl: 3.5, mt: -1 }}>
                            <TextField
                                type="date"
                                size="small"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                sx={{ width: 200 }}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    )}

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
                    disabled={!name.trim() || (startDateConfig === 'custom' && !customDate)}
                    sx={{
                        bgcolor: '#0078d4',
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#106ebe' }
                    }}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};