import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ManagerOverview } from './manager';

const drawerWidth = 240;

export default function DashboardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Box sx={{ display: 'flex' }}>
            {/* Note: This assumes your AppBar has a higher z-index (default is 1100).
         We keep the sidebar permanent but offset its paper position.
      */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        // This is the key: it moves the sidebar content down 
                        // so it starts exactly where the navbar ends.
                        top: '64px', // Standard height of MUI desktop navbar
                        height: 'calc(100% - 64px)',
                        borderRight: '1px solid #e0e0e0'
                    },
                }}
            >
                <List sx={{ pt: 2 }}>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/dashboard/manager")}>
                            <ListItemText primary="Manager tab" />
                        </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/dashboard/employee")}>
                            <ListItemText primary="Employee tab" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Main Content Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: '#f5f5f5',
                    minHeight: '100vh'
                }}
            >
                {/* If your navbar is fixed, you need this spacer here too */}
                <Toolbar />

                <Box sx={{ p: 3 }}>
                    {location.pathname === '/dashboard/manager'
                        ? <ManagerOverview />
                        : <></>
                    }
                </Box>
            </Box>
        </Box>
    );
}