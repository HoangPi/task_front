import { useAppSelector } from '../../redux/hook'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { type NavigateFunction } from "react-router-dom"
import { Avatar, Backdrop, Collapse, Divider, IconButton, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { AccountCircleOutlined, LogoutOutlined } from '@mui/icons-material'

function NavAnonymous({ navigate }: { navigate: NavigateFunction }) {
    return <>
        <Button onClick={() => navigate("/signin")} color="inherit">Sign in</Button>
        <Button onClick={() => navigate("/signup")} color="inherit">Sign up</Button>
    </>
}

function NavLoged({ navigate }: { navigate: NavigateFunction }) {
    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded((prev) => !prev);
    };
    return (
        <>
            {/* The Background Overlay */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={expanded}
                onClick={() => setExpanded(false)}
            />

            {/* The Interactive Container */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'inline-block', // Wraps tightly around the Avatar
                    mt: 2,
                    zIndex: (theme) => expanded ? theme.zIndex.drawer + 2 : 1
                }}
            >
                {/* The Trigger Button - Changed to an Avatar */}
                <IconButton onClick={handleToggle} sx={{ p: 0 }}>
                    <Avatar alt="User Avatar" />
                </IconButton>

                {/* The Floating Area - Width halved to 225px */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        width: 225
                    }}
                >
                    <Collapse in={expanded}>
                        <Paper elevation={4} sx={{ p: 2, mt: 1 }}>

                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                                Main Text
                            </Typography>

                            <Typography variant="body2" sx={{ color: 'grey.800', mb: 2, textAlign: 'right' }}>
                                Smaller, darker text
                            </Typography>

                            {/* Profile Button - No outline, icon on right */}
                            <Button
                                variant="text"
                                fullWidth
                                endIcon={<AccountCircleOutlined />}
                                sx={{
                                    mb: 1, justifyContent: 'right', color: 'text.primary',
                                    '&:hover': {
                                        backgroundColor: 'ActiveText', // Light red background
                                        color: 'ButtonHighlight', // Red text for sign out
                                        transform: 'scale(1.02)', // Slightly grows the button
                                    }
                                }}
                            >
                                Profile
                            </Button>

                            <Divider sx={{ my: 1 }} />

                            {/* Sign Out Button - No outline, icon on right */}
                            <Button
                                variant="text"
                                fullWidth
                                endIcon={<LogoutOutlined />}
                                sx={{
                                    justifyContent: 'right', color: 'text.primary',
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: 'error.light', // Light red background
                                        color: 'ButtonHighlight', // Red text for sign out
                                        transform: 'scale(1.02)', // Slightly grows the button
                                    }
                                }}
                            >
                                Sign out
                            </Button>

                        </Paper>
                    </Collapse>
                </Box>
            </Box>
        </>
    );
}

export function NavSmall({ navigate }: { navigate: NavigateFunction }) {
    const user = useAppSelector(state => state.user)
    return <>
        {user.userId === null ? <NavAnonymous navigate={navigate}></NavAnonymous> : <NavLoged navigate={navigate}></NavLoged>}
    </>
}