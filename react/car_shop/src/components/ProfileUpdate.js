import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../custom_axios';
import Unauthenticated from './Unauthenticated';

//Material UI
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const theme = createTheme();

function ProfileUpdate() {

    const navigate = useNavigate()
	const [formData, setFormData] = useState({});
    const [formErros, setFormErrors] = useState({})

    const user_id = localStorage.getItem('user_id')

    //Fetching Current User Data 
    useEffect(() => {
        axiosInstance.get(`/users/${user_id}/`).
        then((response) => {
            setFormData({
                email: response.data.email,
                username: response.data.username,
                first_name: response.data.first_name,
                last_name: response.data.last_name,
                password: '_',
            })
        }).
        catch((error) => {
            console.log(error)
        })
    }, [])

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
        console.log(formData)
	};

    const handleSubmit = (e) => {
		e.preventDefault()
        axiosInstance.put(
			`users/update/${user_id}/`, 
            formData
		)
		.then((response) => {
            localStorage.setItem('username', response.data.username)
            localStorage.setItem('user_email', response.data.email);
            localStorage.setItem('user_first_name', response.data.first_name);
            localStorage.setItem('user_last_name', response.data.last_name);

			navigate('/profile');
		}).catch((error) =>{
			setFormErrors(error.response.data)
		});

	};

    //Authentication Check
    if (!user_id) return <Unauthenticated />

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
                    <Typography component="h1" variant="h5">
                        Update Your Profile
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formData.email ? formData.email : ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            {formErros.email && <p style={{color:"red"}}>{formErros.email}</p>}
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    value={formData.username ? formData.username : ''}
                                    onChange={handleChange}
                                />
                                {formErros.username && <p style={{color:"red"}}>{formErros.username}</p>}
		 				    </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="first_name"
                                    label="First Name"
                                    type="first-name"
                                    id="first-name"
                                    autoComplete="current-first-name"
                                    value={formData.first_name ? formData.first_name : ''}
                                    onChange={handleChange}
                                />
                                {formErros.first_name && <p style={{color:"red"}}>{formErros.first_name}</p>}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="last_name"
                                    label="Last Name"
                                    type="last-name"
                                    id="last-name"
                                    autoComplete="current-last-name"
                                    value={formData.last_name ? formData.last_name : ''}
                                    onChange={handleChange}
                                />
                                {formErros.last_name && <p style={{color:"red"}}>{formErros.last_name}</p>}
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Update Profile
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default ProfileUpdate;