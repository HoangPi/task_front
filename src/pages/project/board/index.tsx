import { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Layers,
  ViewKanban,
  History,
  Timer,
} from '@mui/icons-material';
import { SelectedIndexContext } from '../selectItemContext';
import { service } from '../../../service';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { addProjectBulk } from '../../../redux/storage/project';
import { BoardSelector } from './selector';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 260;

export default function SidebarLayout() {
  const [selectedItem, setSelectedItem] = useState(-1)
  const [firstRender, setFirstRender] = useState(true);
  const projects = useAppSelector((s) => s.projectStorage.projects)
  const dispatch = useAppDispatch()
  const [openOverview, setOpenOverview] = useState(true);
  const [openBoards, setOpenBoards] = useState(true);
  const location = useLocation();
  const navigate = useNavigate()

  const handleOverviewClick = () => setOpenOverview(!openOverview);
  const handleBoardsClick = () => setOpenBoards(!openBoards);

  useEffect(() => {
    service.projectService.getProjects()
      .then(result => {
        if(result.length){
          setSelectedItem(0)
          dispatch(addProjectBulk(result))
          return;
        }
        throw "EMPTY"
      })
      .catch(e => console.log(e))
      .finally(() => {
        // This ensures the white screen disappears whether the call succeeded or failed
        setFirstRender(false);
      });
  }, [])

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
              {projects.map((item, index)=><MenuItem value={index}>{item.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <List component="nav">
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
              <ListItemButton onClick={()=>navigate("/dashboard/board")} sx={{ pl: 4 }}>
                <ListItemIcon><ViewKanban fontSize="small" /></ListItemIcon>
                <ListItemText primary="Boards" />
              </ListItemButton>
              <ListItemButton onClick={()=>navigate("/dashboard/backlog")} sx={{ pl: 4 }}>
                <ListItemIcon><History fontSize="small" /></ListItemIcon>
                <ListItemText primary="Backlogs" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon><Timer fontSize="small" /></ListItemIcon>
                <ListItemText primary="Sprints" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <SelectedIndexContext value={{ value: selectedItem, dispatcher: setSelectedItem }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, minHeight: '100vh' }}
        >
          <Typography variant="h4">{projects.length ? projects[selectedItem].name : "You do not belong"}</Typography>
          <Typography paragraph>
            {projects.length ? projects[selectedItem].description : ""}
          </Typography>
          <BoardSelector path={location.pathname}/>
        </Box>
      </SelectedIndexContext>
    </Box>
  );
}