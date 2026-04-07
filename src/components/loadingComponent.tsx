import { Box, Stack, CircularProgress, Typography } from "@mui/material";

interface LoadingStateProps {
    message?: string;
    fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    message = "Fetching data...",
    fullScreen = false
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // If fullScreen, take up the whole viewport. Otherwise, fill the parent container with a minimum height.
                minHeight: fullScreen ? '100vh' : '200px',
                height: fullScreen ? '100%' : '100%',
                width: '100%',
                // Use the light gray background for full page loads, transparent for localized sections
                bgcolor: fullScreen ? '#f3f2f1' : 'transparent',
            }}
        >
            <Stack spacing={2} alignItems="center">
                <CircularProgress
                    size={40}
                    thickness={4}
                    sx={{ color: '#0078d4' }} // Standard Azure DevOps blue
                />
                <Typography
                    variant="body2"
                    sx={{ color: '#605e5c', fontWeight: 600 }}
                >
                    {message}
                </Typography>
            </Stack>
        </Box>
    );
};