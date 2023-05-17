import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Unauthenticated from './Unauthenticated';
import axiosInstance from '../custom_axios';

//MaterialUI
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { Typography } from '@mui/material';


function AdvertismentDelete(){

    const navigate = useNavigate()
    const [error, setError] = useState('')
	const advertisment_id = useParams().id

    const current_user_id = localStorage.getItem('user_id')

	const handleSubmit = (e) => {
		e.preventDefault();
		axiosInstance
			.delete(`advertisments/delete/${advertisment_id}`)
            .then((response) => {
                navigate("/profile")
            })
			.catch((error) => {
				console.log(error.response)
                setError(error.response.data.detail)
			})
	};

    //Authentication Check
	if (!current_user_id) return <Unauthenticated />

    return (
        <Container component="main" maxWidth="sm" style={{marginTop: "3%", textAlign:"center"}}>
            { error && (
                <Typography component="h1" variant="h4">
                    {error}
                </Typography>
            )}
            <Box
                display="flex"
                justifyContent="center"
                m={1}
                p={1}
                bgcolor="background.paper"
                style={{marginTop: "3%"}}
            >
                <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    onClick={handleSubmit}
                >
                    Press here to confirm delete
                </Button>
            </Box>
        </Container>
    )
}

export default AdvertismentDelete
