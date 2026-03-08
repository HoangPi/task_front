import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom"

export function NavBar() {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    return (
        <AppBar position="static">
            <Toolbar>
                {/* Home button remains on the left */}
                <Button color="inherit" sx={{ mr: 'auto' }} onClick={() => navigate("/")}>
                    Home
                </Button>

                {/* Desktop View: Pseudo Buttons */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Button color="inherit">Pseudo Button 1</Button>
                    <Button color="inherit">Pseudo Button 2</Button>
                </Box>

                {/* Mobile View: Expandable Hamburger Menu */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        onClick={(event) => handleOpenMenu(event)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        <MenuItem onClick={() => {
                            navigate("/hello")
                            handleCloseMenu()
                            }}>Pseudo Button 1</MenuItem>
                        <MenuItem onClick={handleCloseMenu}>Pseudo Button 2</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}