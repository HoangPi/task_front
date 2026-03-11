import {
    Box,
    Collapse,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar
} from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ManagerOverview } from './manager/manager';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import SignInPage from '../signin';
import ProfilePage from '../profile';
import HomePage from '../main/hompage';

const drawerWidth = 240;

export default function DashboardPage() {
    const navigate = useNavigate();
    // ... inside your component
    const [openManager, setOpenManager] = useState(false);

    const handleManagerClick = () => {
        setOpenManager(!openManager);
    };
    return (
        <Box sx={{ display: 'fixed' }}>
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
                    {/* Manager Tab - The Parent Collapse Button */}
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton onClick={handleManagerClick}>
                            <ListItemText primary="Manager tab" />
                            {openManager ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>

                    {/* Nested Items */}
                    <Collapse in={openManager} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => navigate("/dashboard/manager")}
                            >
                                <ListItemText primary="Overview" />
                            </ListItemButton>

                            <ListItemButton
                                sx={{ pl: 4 }}
                                onClick={() => navigate(`/dashboard/calendar?index=${78}`)}
                            >
                                <ListItemText primary="Calendar" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Regular Employee Tab */}
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
                    <Routes>
                        <Route index element={<HomePage />}></Route>
                        <Route path="/signin" element={<SignInPage></SignInPage>} />
                        <Route path="/profile" element={<ProfilePage></ProfilePage>} />
                        <Route path="/dashboard/manager" element={<ManagerOverview></ManagerOverview>} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
}