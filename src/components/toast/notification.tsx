import React, { useState, useEffect, useContext } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { ToastContext } from './messageContetx';

// Enum for the type (MUI Alert accepts 'success' | 'info' | 'warning' | 'error')
export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning'
}

export interface ToastState {
    message: string;
    type: ToastType;
}

export const GlobalToast = () => {
    // Initial state as requested
    const notification = useContext(ToastContext)

    const [open, setOpen] = useState(false);

    // Trigger toast when message changes
    useEffect(() => {
        if (notification && notification.data) {
            setOpen(true);
        }
    }, [notification]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        notification?.dispatcher(null)
        setOpen(false);
    };
    if (!notification || !notification.data) {
        return <></>
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={notification?.data?.type as AlertColor}
                variant="filled"
                sx={{ width: '100%', boxShadow: 3 }}
            >
                {notification?.data?.message}
            </Alert>
        </Snackbar>
    );
};