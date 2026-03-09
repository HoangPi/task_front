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
import { useNavigate } from 'react-router-dom';
import { UserService } from '../../service/user';
import { useAppDispatch } from '../../redux/hook';
import { setUserInfo } from '../../redux/storage/user';

export default function SignInPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [disabled, setDisable] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    function handleLogin(): void {
        UserService.logIn(username, password)
            .then(user => {
                dispatch(setUserInfo(user))
                navigate("/")
            })
            .catch(error => {
                console.log(error)
                setDisable(false)
            });
        setDisable(true);
    }

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
                            id="username"
                            label="username"
                            name="username"
                            autoComplete="username"
                            defaultValue={username}
                            onChange={(ev) => { setUsername(ev.target.value) }}
                            autoFocus
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            onChange={(ev) => { setPassword(ev.target.value) }}
                            defaultValue={password}
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
                            onClick={handleLogin}
                            fullWidth
                            variant="contained"
                            disabled={disabled}
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