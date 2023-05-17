import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import axiosInstance from '../custom_axios';
import { setAdvertisments, setsearchFieldValue } from '../redux-slices/advertismentSlice';
import sagaActions from '../app/sagaActions';

//Material UI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SearchBar from "material-ui-search-bar";
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';


function Navbar() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [value, setValue] = React.useState('')
    const username = localStorage.getItem('username')

    const handleSearch = (value) => {
        const url = `/search?search=${value}`
        dispatch(setsearchFieldValue(value))

        axiosInstance.get(url).
        then((response) => {
            dispatch(setAdvertisments(response))
        }).
        catch((error) => {
            console.log(error)
        })
        navigate('/advertisments')
    }

    const handleCancelSearch = () => {
        dispatch({ type: sagaActions.FETCH_ADVERTISMENT_SAGA, payload: {'filterString': '/'} })
        dispatch(setsearchFieldValue(''))
    }

    return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <AirportShuttleIcon fontSize='large'/>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} style={{marginLeft:'1%'}}>
                        CarShop
                    </Typography>
                    
                    <SearchBar
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        onRequestSearch={() => handleSearch(value)}
                        onCancelSearch={handleCancelSearch}
                    />

                    <Button color="inherit" onClick={() => navigate('/count')}>Live Add Count</Button>
                    <Button color="inherit" onClick={() => navigate('/advertisments')}>Browse Adds</Button>

                    {!username && <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>}
                    {!username && <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>}

                    {username && <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>}
                    {username && <Button color="inherit" onClick={() => navigate('/logout')}>Logout</Button>}
                </Toolbar>
            </AppBar>
    );
}

export default Navbar;