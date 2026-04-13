import { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Button } from '@mui/material';
import { SearchOffOutlined, HomeOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // 1. Start the countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        // 2. Trigger the actual redirect after 5 seconds
        const redirect = setTimeout(() => {
            navigate('/');
        }, 5000);

        // 3. Cleanup timers if the component unmounts early
        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <Box
            sx={{
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f3f2f1',
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
                {/* 404 Icon */}
                <Box sx={{ mb: 2, color: '#605e5c' }}>
                    <SearchOffOutlined sx={{ fontSize: 64 }} />
                </Box>

                {/* Messaging */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#323130' }}>
                    404 - Page Not Found
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, px: 1 }}>
                    The page you are looking for doesn't exist or has been moved. Redirecting to the homepage in <strong>{countdown}</strong> seconds...
                </Typography>

                {/* Loading Spinner */}
                <Box sx={{ mb: 4 }}>
                    <CircularProgress size={28} thickness={4} sx={{ color: '#0078d4' }} />
                </Box>

                {/* Manual Override Button */}
                <Button
                    variant="contained"
                    startIcon={<HomeOutlined />}
                    onClick={() => navigate('/')}
                    fullWidth
                    sx={{
                        bgcolor: '#0078d4',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                    }}
                >
                    Return to Homepage
                </Button>
            </Paper>
        </Box>
    );
};