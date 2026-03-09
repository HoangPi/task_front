import {
    Box,
    TextField,
    Typography,
    Paper,
    Container,
    Button
} from '@mui/material';
import { useAppSelector } from '../../redux/hook';
import { useState } from 'react';

export default function ProfilePage() {
    const user = useAppSelector(s => s.user)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.name)
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
                        sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        Save Profile
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}