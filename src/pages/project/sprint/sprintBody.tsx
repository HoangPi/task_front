import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Stack, Typography, Chip, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ToastContext } from "../../../components/toast/messageContetx";
import { ToastType } from "../../../components/toast/notification";
import type { Sprint } from "../../../redux/storage/sprint";
import { service } from "../../../service";
import type { Backlog } from "../board/components/sprintCard";
import { SelectedIndexContext } from "../selectItemContext";
import { ProductBacklogList } from "./backlogSelector";
import { WorkItemDialog } from "../board/components/sprintDialog";
import { CheckCircle, DoneAll, Flag } from "@mui/icons-material";
import { LoadingState } from "../../../components/loadingComponent";

export const SprintPage = ({ sprint, updateSprints, createSprintBacklogHandler }: {
    sprint: Sprint, updateSprints:
    React.Dispatch<React.SetStateAction<Sprint[] | undefined>>,
    createSprintBacklogHandler: (backlogId: number, sprint_id: number) => Promise<void | undefined>
}) => {
    const [backlogs, setBacklogs] = useState<Backlog[]>([])
    const [selectedBacklog, setSelectedBacklog] = useState<Backlog | null>(null)
    const projectIndex = useContext(SelectedIndexContext)
    const toastContext = useContext(ToastContext)
    const [openFinishDialog, setOpenFinishDialog] = useState(false)
    const [finishDialogMessage, setFinishDialogMessage] = useState("")
    const [finishDialogTitle, setFinishDialogTitle] = useState("")
    const [requireFinishInput, setRequireFinishInput] = useState(false)
    const [isFetchingBacklogs, setIsfetchingBacklogs] = useState(true)
    const [productBacklogRefreshKey, setProductBacklogRefreshKey] = useState(String(new Date()))
    const fetchSprintBacklogs = () => {
        setIsfetchingBacklogs(true)
        return service.projectService.getSprintBacklogBySprintId(sprint.id)
            .then(result => setBacklogs(result))
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
            .finally(() => setIsfetchingBacklogs(false));
    }

    // Optimistic update, update local states before the request is resolved
    function handleFinishSprint() {
        setProductBacklogRefreshKey(String(Date.now()))
        if (finishDialogTitle === "Finish Sprint") {
            service.projectService.finishSprint(sprint.id)
                .catch((e) => {
                    toastContext?.dispatcher({ message: e, type: ToastType.ERROR });
                    fetchSprintBacklogs();
                });
            setBacklogs(backlogs.map((item) => {
                if (item.status === 'finished' || item.status === 'failed') {
                    return item;
                }
                return { ...item, status: 'failed' };
            }));
            updateSprints((sprints) => {
                return sprints?.map((item) => item.id !== sprint.id ? item : { ...item, status: 'finished' })
            })
            return;
        }
        service.projectService.finishOverdueSprints(sprint.project_id)
            .catch((e) => {
                toastContext?.dispatcher({ message: e, type: ToastType.ERROR });
            })
            .finally(() => { return fetchSprintBacklogs(); });
        const currentDate = new Date();
        updateSprints((sprints) => {
            {
                return sprints?.map((item) =>
                    new Date(item.end_date) < currentDate ? { ...item, status: 'finished' } : item
                )
            }
        })
        if (new Date(sprint.end_date) < currentDate) {
            setBacklogs(backlogs.map(item => item.status !== 'finished' ? { ...item, status: 'failed' } : item))
        }
    }
    useEffect(() => {
        fetchSprintBacklogs()
    }, [sprint.id, projectIndex.value])
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
                        {!isFetchingBacklogs && backlogs.map((item) => (
                            <TableRow
                                onClick={() => setSelectedBacklog(item)}
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
            {isFetchingBacklogs && <LoadingState />}
            {selectedBacklog && <WorkItemDialog open={selectedBacklog !== null} handleClose={() => {
                fetchSprintBacklogs().then(() => setSelectedBacklog(null))
            }} backlog={selectedBacklog} />}
            <Stack direction="row" spacing={2} marginTop={2} alignItems="center">
                {/* Button 1: Finish Sprint / Finished State */}
                <Button
                    variant={sprint.status === 'finished' ? "outlined" : "contained"}
                    disabled={sprint.status === 'finished'}
                    startIcon={sprint.status === 'finished' ? <CheckCircle /> : <Flag />}
                    onClick={() => {
                        setOpenFinishDialog(true)
                        setFinishDialogTitle("Finish Sprint")
                        const required = new Date() < new Date(sprint.end_date)
                        setRequireFinishInput(required)
                        if (required) {
                            setFinishDialogMessage("Sprint is not finished yet.")
                        }
                        else {
                            setFinishDialogMessage("Press confirm to continue.")
                        }
                    }}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        ...(sprint.status !== 'finished' && {
                            bgcolor: '#0078d4',
                            '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                        }),
                        // Styling for the disabled 'Finished' state to make it look intentional
                        '&.Mui-disabled': {
                            borderColor: '#edebe9',
                            color: '#107c10', // Green text to indicate success
                            bgcolor: '#dff6dd' // Light green background
                        }
                    }}
                >
                    {sprint.status === 'finished' ? 'Sprint Finished' : 'Finish Sprint'}
                </Button>

                {/* Button 2: Finish All */}
                <Button
                    variant="outlined"
                    startIcon={<DoneAll />}
                    onClick={() => {
                        setOpenFinishDialog(true)
                        setFinishDialogMessage("This action will make unfinished sprint backlogs of overdue sprints fail. Proceed?")
                        setFinishDialogTitle("Finish All")
                        setRequireFinishInput(false)
                    }}
                    sx={{
                        color: '#323130',
                        borderColor: '#edebe9',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#f3f2f1', borderColor: '#c8c6c4' }
                    }}
                >
                    Finish All
                </Button>
            </Stack>
            <SprintConfirmDialog
                open={openFinishDialog}
                onClose={() => setOpenFinishDialog(false)}
                onConfirm={handleFinishSprint}
                title={finishDialogTitle}
                message={finishDialogMessage}
                requireInput={requireFinishInput}
                sprintName={sprint.name}
            />
            <ProductBacklogList key={productBacklogRefreshKey} sprint_id={sprint.id} createSprintBacklogHandler={(backlogId: number, sprint_id: number) => {
                return createSprintBacklogHandler(backlogId, sprint_id).then(() => { return fetchSprintBacklogs() })
            }} />
        </Box>
    );
};

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    requireInput?: boolean;
    sprintName?: string;
}

const SprintConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed with this action?",
    requireInput = false,
    sprintName = "Sprint"
}) => {
    const [inputValue, setInputValue] = useState('');

    // Dynamically generate the required target string
    const targetString = `#${sprintName}#`;

    const handleConfirm = () => {
        onConfirm();
        setInputValue(''); // Reset on success
        onClose();
    };

    const handleClose = () => {
        setInputValue(''); // Reset on cancel
        onClose();
    };

    // Logic: Disable if input is required AND the value doesn't match the target
    const isConfirmDisabled = requireInput ? inputValue !== targetString : false;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #edebe9', pb: 1.5 }}>
                {title}
            </DialogTitle>

            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ pt: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: requireInput ? 2 : 0 }}>
                        {message}
                    </Typography>

                    {/* Conditional Input Field */}
                    {requireInput && (
                        <>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#323130' }}>
                                Type <strong>{targetString}</strong> to confirm.
                            </Typography>

                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={targetString}
                                autoComplete="off"
                            />
                        </>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, borderTop: '1px solid #edebe9' }}>
                <Button
                    onClick={handleClose}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        // If requiring input, it's usually a destructive/major action, so we color it red.
                        // Otherwise, use the standard blue.
                        bgcolor: requireInput ? '#d13438' : '#0078d4',
                        '&:hover': {
                            bgcolor: requireInput ? '#a4262c' : '#106ebe',
                            boxShadow: 'none'
                        }
                    }}
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

