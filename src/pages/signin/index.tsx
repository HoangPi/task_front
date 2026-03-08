import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Container,
    IconButton,
    InputAdornment,
    Link,
    Checkbox,
    FormControlLabel,
    Grid
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Box
            sx={{
                backgroundColor: '#f5f5f5',
                minHeight: '80vh',
                maxHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2,
                    }}
                >
                    {/* Header Icon */}
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Sign In
                    </Typography>

                    {/* Form */}
                    <Box component="form" noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                            sx={{ mt: 1 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                fontWeight: 'bold',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                    boxShadow: 4,
                                }
                            }}
                        >
                            Sign In
                        </Button>

                        <Grid container>
                            <Grid size={12}>
                                <Link href="#" variant="body2" underline="hover">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid size={12}>
                                <Link href="#" variant="body2" underline="hover">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    {'Copyright © '}
                    <Link color="inherit" href="#">
                        Your Brand
                    </Link>{' '}
                    {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Box>
    );
}