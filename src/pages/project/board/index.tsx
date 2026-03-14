import { useState } from 'react';
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

const drawerWidth = 260;

export default function SidebarLayout() {
  const [openOverview, setOpenOverview] = useState(true);
  const [openBoards, setOpenBoards] = useState(true);
  const [project, setProject] = useState('10');

  const handleOverviewClick = () => setOpenOverview(!openOverview);
  const handleBoardsClick = () => setOpenBoards(!openBoards);

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
              value={project}
              label="Project"
              onChange={(e) => setProject(e.target.value)}
            >
              <MenuItem value={10}>Marketing Team</MenuItem>
              <MenuItem value={20}>Dev Operations</MenuItem>
              <MenuItem value={30}>Product Design</MenuItem>
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
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon><ViewKanban fontSize="small" /></ListItemIcon>
                <ListItemText primary="Boards" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
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
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, minHeight: '100vh' }}
      >
        <Typography variant="h4">Main Content</Typography>
        <Typography paragraph>
          This area will stay to the right of your fixed sidebar.
        </Typography>
      </Box>
    </Box>
  );
}