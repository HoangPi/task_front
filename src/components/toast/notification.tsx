import React, { useState, useEffect, useContext } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';
import { ToastContext } from './messageContetx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hook';
import { removeUserInfomation } from '../../redux/storage/user';

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
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [open, setOpen] = useState(false);

    // Trigger toast when message changes
    useEffect(() => {
        if (notification && notification.data) {
            setOpen(true);
            setTimeout(handleClose, 3000)
            if (notification.data.message === "Token has expired") {
                dispatch(removeUserInfomation())
                navigate('/signin')
            }
        }
    }, [notification]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        event;
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