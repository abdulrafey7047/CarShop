import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import axiosInstance from '../custom_axios';
import { GoogleLogin } from 'react-google-login';
import { gapi } from "gapi-script";
import axios from 'axios';

//Material UI
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


const theme = createTheme();

//Helper Functions
const setLocalStorageItems = (server_response) => {
    localStorage.setItem('access_token', server_response.data.access)
    localStorage.setItem('refresh_token', server_response.data.refresh)
    localStorage.setItem('user_id', server_response.data.user.id)
    localStorage.setItem('username', server_response.data.user.username)
    localStorage.setItem('user_email', server_response.data.user.email);
    localStorage.setItem('user_first_name', server_response.data.user.first_name);
    localStorage.setItem('user_last_name', server_response.data.user.last_name);
}

const useStyles = makeStyles(() => ({
	roundButton: {
		borderRadius: '10px'
	},
}))

function Login() {
    
    const classes = useStyles()
    const navigate = useNavigate()
	const [formData, updateFormData] = useState({})
    const [errors, setErros] = useState({})

    useEffect(() => {
        function start() {
          gapi.client.init({
            clientId: process.env.REACT_PUBLIC_GOOGLE_CLIENT_ID,
            scope: 'email',
          });
        }
    
        gapi.load('client:auth2', start);
      }, []);


	const handleChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

    const handleSubmit = (e) => {
		e.preventDefault();

        axiosInstance.post(
            `token/`,
            formData
        ).then((response) => {
            setLocalStorageItems(response)
            axiosInstance.defaults.headers['Authorization'] =
                'JWT ' + localStorage.getItem('access_token');

            navigate('/advertisments')
        }
        ).catch((error) => {
            setErros(error.response.data)
        })
	};

    const onGoogleLoginSuccess = (response) => {
        const idToken = response.tokenId;
        const data = {
            id_token: response.tokenId,
            email: response.profileObj.email,
            first_name: response.profileObj.givenName,
            last_name: response.profileObj.familyName,
            username: response.googleId,
        };

        const headers = {
            Authorization: idToken,
            'Content-Type': 'application/json'
        };

          axios.post(`${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/users/google-login/`, data, { headers }
          ).then((response) => {
            setLocalStorageItems(response)
            axiosInstance.defaults.headers['Authorization'] =
                'JWT ' + localStorage.getItem('access_token');

            navigate('/advertisments')

          }).catch((error) => {
            setErros(error.response.data)
          })
        }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h3" variant="h5">
                        Login
                    </Typography>
                    <Typography  component="h1" variant="h5" style={{color:"red", textAlign:"center"}}>
                        {errors.detail}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            error={errors.username}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={handleChange}
                            helperText={errors.username && errors.username}
                        />
                        <TextField
                            error={errors.password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleChange}
                            helperText={errors.password && errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Login
                        </Button>
                        <Grid container>
                            <Grid item xs={12} md={12} style={{textAlign:'center'}}>
                                <Link href="/register" variant="body2" >
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>

                            <Grid item xs={12} md={12} style={{textAlign:'center', marginTop:'2%'}}>
                                <GoogleLogin
                                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}           
                                    onSuccess={onGoogleLoginSuccess}
                                    onFailure={(response) => console.log(response)}
                                    className={classes.roundButton}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default Login
