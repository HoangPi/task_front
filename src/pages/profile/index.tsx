import {
    Box,
    TextField,
    Typography,
    Paper,
    Container,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack
} from '@mui/material';
import { reduxService, useAppDispatch, useAppSelector } from '../../redux/hook';
import { useContext, useState } from 'react';
import { service } from '../../service';
import { ToastContext } from '../../components/toast/messageContetx';
import { ToastType } from '../../components/toast/notification';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const user = useAppSelector(s => s.user)
    const [name, setName] = useState(user.name || "")
    const [email, setEmail] = useState(user.email || "")
    const toastContext = useContext(ToastContext)

    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    function handlePasswordChangeSubmit(): Promise<void> {
        if (newPassword !== confirmPassword) {
            toastContext?.dispatcher({ message: "Passwords do not match", type: ToastType.ERROR })
            return new Promise((resolve) => resolve())
        }
        return service.userService.changePassword(user.userId || 0, oldPassword, confirmPassword)
            .then(() => toastContext?.dispatcher({ message: "Password changed, heading to login page", type: ToastType.SUCCESS }))
            .then(() => {
                dispatch(reduxService.userService.removeUserInfomation())
                setTimeout(() => {
                    navigate("/signin")
                }, 1000)
                return
            }
            )
            .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                    Profile Settings
                </Typography>

                <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Username: Immutable */}
                    <TextField
                        label="Username"
                        defaultValue={user.username}
                        disabled
                        fullWidth
                        helperText="Username cannot be changed."
                    />

                    {/* Name */}
                    <TextField
                        label="Full Name"
                        onChange={(ev) => setName(ev.target.value)}
                        defaultValue={name}
                        fullWidth
                    />

                    {/* Email */}
                    <TextField
                        label="Email Address"
                        defaultValue={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        type="email"
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            if (!user.userId) {
                                toastContext?.dispatcher({ message: "Token has expired", type: ToastType.ERROR })
                                return
                            }
                            service.userService.updateUser(user.userId || -1, name, email)
                                .then(() => service.userService.VerifyUserSession())
                                .then(res => dispatch(reduxService.userService.setUserInfo(res)))
                                .then(() => toastContext?.dispatcher({ message: "Information saved", type: ToastType.SUCCESS }))
                                .catch(e => toastContext?.dispatcher({ message: String(e), type: ToastType.ERROR }))
                        }}
                        sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Save Profile
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setOpenPasswordDialog(true)}
                        sx={{ py: 1.5, fontWeight: 'bold', borderColor: '#b00707', color: '#8a1b19' }}
                    >
                        Change Password
                    </Button>
                    <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} fullWidth maxWidth="xs">
                        <DialogTitle sx={{ fontWeight: 700, borderBottom: '1px solid #edebe9', pb: 1.5 }}>
                            Change Password
                        </DialogTitle>
                        <DialogContent sx={{ mt: 2 }}>
                            <Stack spacing={3} sx={{ pt: 1 }}>
                                <TextField
                                    label="Current Password"
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                />
                                <TextField
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    fullWidth
                                    size="small"
                                    error={newPassword !== confirmPassword && confirmPassword.length > 0}
                                    helperText={newPassword !== confirmPassword && confirmPassword.length > 0 ? "Passwords do not match" : ""}
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions sx={{ p: 2, borderTop: '1px solid #edebe9' }}>
                            <Button onClick={() => setOpenPasswordDialog(false)} sx={{ color: 'text.secondary', textTransform: 'none' }}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handlePasswordChangeSubmit}
                                disabled={!oldPassword || !newPassword || newPassword !== confirmPassword}
                                sx={{ bgcolor: '#0078d4', textTransform: 'none' }}
                            >
                                Update
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
        </Container>
    );
}