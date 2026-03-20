import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Layers,
  ViewKanban,
  History,
  Timer,
  Delete,
  Add,
} from '@mui/icons-material';
import { SelectedIndexContext } from '../selectItemContext';
import { service } from '../../../service';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { addProjectBulk, clearProject } from '../../../redux/storage/project';
import { BoardSelector } from './selector';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearSprint } from '../../../redux/storage/sprint';
import { ToastContext } from '../../../components/toast/messageContetx';
import { ToastType } from '../../../components/toast/notification';
import { AddMemberButton } from './components/searchUserButton';

const drawerWidth = 260;

export default function SidebarLayout() {
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedItem, setSelectedItem] = useState(0)
  const [firstRender, setFirstRender] = useState(true);
  const projects = useAppSelector((s) => s.projectStorage.projects)
  const dispatch = useAppDispatch()
  const [openOverview, setOpenOverview] = useState(true);
  const [openBoards, setOpenBoards] = useState(true);
  const location = useLocation();
  const navigate = useNavigate()
  const toastContext = useContext(ToastContext)


  const handleOverviewClick = () => setOpenOverview(!openOverview);
  const handleBoardsClick = () => setOpenBoards(!openBoards);

  const fetchProjects = () => {
    return service.projectService.getProjects()
      .then(result => {
        if (result.length) {
          setSelectedItem(0)
          dispatch(addProjectBulk(result))
          setSelectedItem(0)
          return;
        }
        dispatch(clearProject());
        setSelectedItem(-1)
        throw "User is not in any project yet"
      })
      .catch(e => {
        toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR })
      })
      .finally(() => {
        // This ensures the white screen disappears whether the call succeeded or failed
        setFirstRender(false);
      });
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    dispatch(clearSprint());
  }, [selectedItem])

  if (firstRender) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'white',
        }}
      />
    );
  }
  if (projects.length <= 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          p: 4,
          m: 3,
          bgcolor: '#faf9f8',
          borderRadius: 2,
          border: '2px dashed #edebe9',
        }}
      >
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#323130' }}>
            You are not in any project
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400, mb: 1 }}>
            Get started by creating a new project to manage your backlogs, sprints, and team workflows.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setOpen(true) }}
            sx={{
              bgcolor: '#0078d4',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
            }}
          >
            Create New Project
          </Button>
        </Stack>
        <CreateProjectDialog open={open} onClose={() => {
          fetchProjects()
            .then(() => setOpen(false))
        }} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            paddingTop: '12vh', // As requested
            backgroundColor: '#f9fafb',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ px: 2, pb: 2 }}>
          {/* Select Button Section */}
          <FormControl fullWidth size="small">
            <InputLabel id="project-select-label">Project</InputLabel>
            <Select
              labelId="project-select-label"
              value={selectedItem}
              label="Project"
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {projects.map((item, index) => <MenuItem value={index}>{item.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <List
          component="nav"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%' // Ensures the list takes full height to push items to the bottom
          }}
        >
          {/* Overview Collapse Section */}
          <ListItemButton onClick={handleOverviewClick}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Overview" />
            {openOverview ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openOverview} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {['Home', 'Analytics', 'Reports'].map((text) => (
                <ListItemButton key={text} sx={{ pl: 4 }}>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Boards Collapse Section */}
          <ListItemButton onClick={handleBoardsClick}>
            <ListItemIcon>
              <Layers />
            </ListItemIcon>
            <ListItemText primary="Boards" />
            {openBoards ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openBoards} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton onClick={() => navigate("/dashboard/board")} sx={{ pl: 4 }}>
                <ListItemIcon><ViewKanban fontSize="small" /></ListItemIcon>
                <ListItemText primary="Boards" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/dashboard/backlog")} sx={{ pl: 4 }}>
                <ListItemIcon><History fontSize="small" /></ListItemIcon>
                <ListItemText primary="Backlogs" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate("/dashboard/sprint")} sx={{ pl: 4 }}>
                <ListItemIcon><Timer fontSize="small" /></ListItemIcon>
                <ListItemText primary="Sprints" />
              </ListItemButton>
            </List>
          </Collapse>

          {/* Spacer that pushes the following content to the bottom */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Bottom Action Buttons */}
          <Box sx={{ px: 2, pb: 2, pt: 1 }}>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              <AddMemberButton project_id={projects[selectedItem].id}/>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => { setOpen(true) }}
                fullWidth
                sx={{
                  bgcolor: '#0078d4',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                  justifyContent: 'flex-start',
                  px: 2,
                  '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                }}
              >
                Create New Project
              </Button>


              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  setOpenDelete(true)
                }}
                fullWidth
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  justifyContent: 'flex-start',
                  px: 2,
                }}
              >
                Delete Project
              </Button>
            </Stack>
          </Box>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <SelectedIndexContext value={{ value: selectedItem, dispatcher: setSelectedItem }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, minHeight: '100vh' }}
        >
          <Typography variant="h4">{projects && projects.length > 0 ? projects[selectedItem].name : "You do not belong"}</Typography>
          <Typography paragraph>
            {projects.length ? projects[selectedItem].description : ""}
          </Typography>
          <BoardSelector path={location.pathname} />
        </Box>
      </SelectedIndexContext>
      <CreateProjectDialog open={open} onClose={() => {
        fetchProjects().then(() => setOpen(false))
      }} />
      <DeleteDialog open={openDelete} id={selectedItem} onClose={() => {
        fetchProjects().then(() => setOpenDelete(false))
      }} />
    </Box>
  );
}

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ open, onClose }) => {
  // --- State for the payload properties ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sprintLength, setSprintLength] = useState<number>(2); // Default to 2 (weeks)
  const [sprintStartDay, setSprintStartDay] = useState<number>(1); // Default to 1 (Monday)
  const [workDayHour, setWorkDayHour] = useState<number>(8); // Default to 8 (hours)
  const toastContext = useContext(ToastContext)

  const handleCreate = () => {
    const payload = {
      name,
      description,
      sprint_length: sprintLength,
      sprint_start_day: sprintStartDay,
      work_day_hour: workDayHour,
      default_day_off: 96
    };
    service.projectService.createProject(payload)
      .then(() => {
        toastContext?.dispatcher({ message: "New project added", type: ToastType.SUCCESS })
      })
      .catch((e) => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
      .finally(() => onClose())
  };

  useEffect(() => {
    if (open) {
      setDescription("")
      setName("")
      setSprintLength(2)
      setWorkDayHour(6)
      setSprintStartDay(1)
    }
  }, [open])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #edebe9', pb: 1.5 }}>
        Create New Project
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Stack spacing={3} sx={{ pt: 1 }}>

          {/* Project Name */}
          <TextField
            label="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
            required
            placeholder="e.g., Car saler"
          />

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Build a web page for car selling"
          />

          {/* Configuration Grid */}
          <Grid container spacing={2}>

            {/* Sprint Length */}
            <Grid size={4}>
              <TextField
                label="Sprint Length (Weeks)"
                type="number"
                value={sprintLength}
                onChange={(e) => setSprintLength(Number(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 1, max: 8 }}
              />
            </Grid>

            {/* Sprint Start Day */}
            <Grid size={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="sprint-start-day-label">Sprint Start Day</InputLabel>
                <Select
                  labelId="sprint-start-day-label"
                  label="Sprint Start Day"
                  value={sprintStartDay}
                  onChange={(e) => setSprintStartDay(Number(e.target.value))}
                >
                  <MenuItem value={0}>Sunday</MenuItem>
                  <MenuItem value={1}>Monday</MenuItem>
                  <MenuItem value={2}>Tuesday</MenuItem>
                  <MenuItem value={3}>Wednesday</MenuItem>
                  <MenuItem value={4}>Thursday</MenuItem>
                  <MenuItem value={5}>Friday</MenuItem>
                  <MenuItem value={6}>Saturday</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Work Day Hours */}
            <Grid size={4}>
              <TextField
                label="Working Hours/Day"
                type="number"
                value={workDayHour}
                onChange={(e) => setWorkDayHour(Number(e.target.value))}
                fullWidth
                size="small"
                inputProps={{ min: 1, max: 24 }}
              />
            </Grid>
          </Grid>

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
          onClick={handleCreate}
          disabled={!name.trim()}
          sx={{
            bgcolor: '#0078d4',
            textTransform: 'none',
            '&:hover': { bgcolor: '#106ebe' }
          }}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const DeleteDialog = ({ open, onClose, id }: { open: boolean, onClose: () => void, id: number }) => {
  const projects = useAppSelector(state => state.projectStorage.projects)
  const [confirmText, setConfirmText] = useState('');
  const [targetString, setTargetString] = useState('');
  const toastContext = useContext(ToastContext)

  const handleDelete = () => {
    if (targetString !== confirmText) {
      setConfirmText('')
      onClose()
      return
    }
    service.projectService.deleteProject(projects[id].id)
      .catch((e) => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
      .finally(() => onClose())
    setConfirmText('')
  };
  const handleClose = () => {
    setConfirmText('');
    onClose();
  };
  useEffect(() => {
    if (open) {
      if (projects.length <= 0 || id < 0) {
        return
      }
      setTargetString(`#${projects[id].name}#`)
    }
  }, [open])
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, color: '#d13438', borderBottom: '1px solid #edebe9', pb: 1.5 }}>
        Delete Project
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            This action cannot be undone. This will permanently delete the project,
            sprints, and all associated work items.
          </Typography>

          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#323130' }}>
            Type <strong>{targetString}</strong> to confirm.
          </Typography>

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={targetString}
            autoComplete="off"
          />
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
          color="error"
          onClick={handleDelete}
          disabled={confirmText !== targetString}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none'
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};