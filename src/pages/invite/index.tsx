import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import { useContext } from 'react';
import { NotificationContext } from '../../components/nav/notificationContext';
import { service } from '../../service';
import { ToastContext } from '../../components/toast/messageContetx';
import { ToastType } from '../../components/toast/notification';

export const InvitationActionPage = () => {
    const noticeContext = useContext(NotificationContext)
    const toastContext = useContext(ToastContext)
    const handleAccept = () => {
        if (!noticeContext?.message?.id) {
            return
        }
        service.userService.updateInvitation(noticeContext?.message?.id, true)
            .then(() => toastContext?.dispatcher({ message: "You have been added to the project", type: ToastType.SUCCESS }))
            .catch((e) => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
    };
    const handleDecline = () => {
        if (!noticeContext?.message?.id) {
            return
        }
        service.userService.updateInvitation(noticeContext?.message?.id, false)
            .then(() => toastContext?.dispatcher({ message: "You have been added to the project", type: ToastType.SUCCESS }))
            .catch((e) => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
    };

    return (
        <Box
            sx={{
                // minHeight: '100vh',
                minHeight: '85vh',
                maxHeight: '85vh',
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
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    border: '1px solid #edebe9',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    textAlign: 'center'
                }}
            >
                {/* Optional Icon */}
                <Box sx={{ mb: 2, color: '#0078d4' }}>
                    <MailOutline sx={{ fontSize: 48 }} />
                </Box>

                {/* Message Content */}
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#323130' }}>
                    Project Invitation #{noticeContext?.message?.id}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
                    {noticeContext?.message?.message}
                </Typography>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="outlined"
                        onClick={handleDecline}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            color: '#605e5c',
                            borderColor: '#edebe9',
                            minWidth: 100,
                            '&:hover': { bgcolor: '#f3f2f1', borderColor: '#c8c6c4' }
                        }}
                    >
                        Decline
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        sx={{
                            bgcolor: '#0078d4',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: 'none',
                            minWidth: 100,
                            '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                        }}
                    >
                        Accept
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};