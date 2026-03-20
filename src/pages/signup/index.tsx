import React, { useContext, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Stack,
    Link,
    Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { service } from '../../service';
import { ToastContext } from '../../components/toast/messageContetx';
import { ToastType } from '../../components/toast/notification';

export const SignUpPage = () => {
    // State matching your required payload
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toastContext = useContext(ToastContext)
    const navigate = useNavigate()

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        service.userService.createUser(username, name, email, password)
            .then(() => {
                toastContext?.dispatcher({ message: "User created, heading to login page", type: ToastType.SUCCESS })
                setTimeout(() => {
                    navigate("/signin")
                }, 2000);
            })
            .catch((e) => toastContext?.dispatcher({ message: e, type: ToastType.ERROR }))
    };

    // Basic validation to disable button if fields are empty
    const isFormValid = username.trim() && name.trim() && email.trim() && password.length > 0;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#f3f2f1' // Light gray background
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        border: '1px solid #edebe9',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#323130' }}>
                        Create an account
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                        Enter your details to get started.
                    </Typography>

                    <Box component="form" onSubmit={handleSignUp} noValidate>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Username"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <TextField
                                label="Full Name"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <TextField
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                size="small"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!isFormValid}
                                sx={{
                                    mt: 2,
                                    py: 1,
                                    bgcolor: '#0078d4',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#106ebe', boxShadow: 'none' }
                                }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    </Box>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Already have an account?{' '}
                            <Link onClick={() => navigate("/signin")} underline="hover" sx={{ color: '#0078d4', fontWeight: 600 }}>
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};