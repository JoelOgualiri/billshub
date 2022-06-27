import { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrandLogo } from './BrandLogo';

const theme = createTheme();
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                <BrandLogo />
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export const FormSignup = ({ onClick }) => {
    const [user, setUser] = useState({});
    const handleSubmit = (e) => {
        e.preventDefault()
        onClick(user)
    }
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="firstname"
                            label="firstname"
                            name="firstname"
                            autoComplete="firstname"
                            autoFocus
                            onChange={e => setUser({ ...user, firstname: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="lastname"
                            label="lastname"
                            name="lastname"
                            autoComplete="lastname"
                            autoFocus
                            onChange={e => setUser({ ...user, lastname: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={e => setUser({ ...user, username: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={e => setUser({ ...user, email: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setUser({ ...user, password: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="city"
                            label="city"
                            name="city"
                            autoComplete="city"
                            autoFocus
                            onChange={e => setUser({ ...user, city: e.target.value })}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="country"
                            label="country"
                            name="country"
                            autoComplete="country"
                            autoFocus
                            onChange={e => setUser({ ...user, country: e.target.value })}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Have an account? Sign in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    )
}




