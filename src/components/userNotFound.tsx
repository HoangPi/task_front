import { PersonOffOutlined } from "@mui/icons-material";
import { Box, Paper, Typography, CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserNotFoundPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // 1. Start the countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // 2. Trigger the actual redirect after 3 seconds
        const redirect = setTimeout(() => {
            navigate('/signin'); // Make sure this matches your actual login route
        }, 3000);

        // 3. Cleanup timers if the component unmounts early
        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f3f2f1', // Full-screen light gray background
                p: 2
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    maxWidth: 400,
                    width: '100%',
                    border: '1px solid #edebe9',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    textAlign: 'center',
                    bgcolor: '#fff'
                }}
            >
                {/* Missing User Icon */}
                <Box sx={{ mb: 2, color: '#605e5c' }}>
                    <PersonOffOutlined sx={{ fontSize: 64 }} />
                </Box>

                {/* Messaging */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#323130' }}>
                    User Not Found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, px: 1 }}>
                    We couldn't find an account matching those details. Redirecting to the login page in <strong>{countdown}</strong> seconds...
                </Typography>

                {/* Loading Spinner */}
                <Box sx={{ mb: 4 }}>
                    <CircularProgress size={28} thickness={4} sx={{ color: '#0078d4' }} />
                </Box>

                {/* Manual Override Button */}
                <Button
                    variant="outlined"
                    onClick={() => navigate('/signin')}
                    fullWidth
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        color: '#323130',
                        borderColor: '#edebe9',
                        '&:hover': { bgcolor: '#f3f2f1', borderColor: '#c8c6c4' }
                    }}
                >
                    Go to Login Now
                </Button>
            </Paper>
        </Box>
    );
};