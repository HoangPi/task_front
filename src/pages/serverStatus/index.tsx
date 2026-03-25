import React from 'react';
import { Box, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { 
  CloudDoneOutlined, 
  CloudOffOutlined, 
  Refresh 
} from '@mui/icons-material';

interface ServerStatusPageProps {
  isTryingToConnect: boolean;
  isServerDown: boolean;
  onRetry: () => void;
}

export const ServerStatusPage: React.FC<ServerStatusPageProps> = ({ 
  isTryingToConnect, 
  isServerDown, 
  onRetry 
}) => {
  // If we aren't trying to connect and the server isn't down, it must be running.
  const isRunning = !isTryingToConnect && !isServerDown;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
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
          maxWidth: 450, 
          width: '100%',
          border: '1px solid',
          borderColor: isRunning ? '#dff6dd' : isServerDown ? '#fde7e9' : '#edebe9', 
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          textAlign: 'center',
          bgcolor: '#fff'
        }}
      >
        {/* Dynamic Icon / Spinner */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', height: 64 }}>
          {isTryingToConnect ? (
            <CircularProgress size={64} thickness={4} sx={{ color: '#0078d4' }} />
          ) : isServerDown ? (
            <CloudOffOutlined sx={{ fontSize: 64, color: '#d13438' }} />
          ) : (
            <CloudDoneOutlined sx={{ fontSize: 64, color: '#107c10' }} />
          )}
        </Box>

        {/* Dynamic Title */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#323130' }}>
          {isTryingToConnect 
            ? 'Connecting...' 
            : isServerDown 
              ? 'Server Unavailable' 
              : 'Server is Online'}
        </Typography>
        
        {/* Dynamic Subtext */}
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: (isServerDown && !isTryingToConnect) ? 4 : 0, px: 2 }}>
          {isTryingToConnect 
            ? 'Please wait while we establish a connection to the backend services.' 
            : isServerDown 
              ? 'We are currently unable to connect to the backend services. Please check your network connection or try again later.'
              : 'All backend services are running smoothly. You are connected and ready to go.'}
        </Typography>

        {/* Action Button - Only shows when server is down and NOT currently trying to connect */}
        {isServerDown && !isTryingToConnect && (
          <Button 
            variant="contained" 
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{ 
              bgcolor: '#0078d4', 
              textTransform: 'none', 
              fontWeight: 600, 
              px: 4,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
            }}
          >
            Retry Connection
          </Button>
        )}
      </Paper>
    </Box>
  );
};