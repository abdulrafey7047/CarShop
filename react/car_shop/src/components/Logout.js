import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


//Custom Modules
import axiosInstance from '../custom_axios';

function Logout() {

	const navigate = useNavigate()
	useEffect(() => {
		const response = axiosInstance.post('/logout/', {
			refresh_token: localStorage.getItem('refresh_token'),
		});

        console.log('Removing Tokens')
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('user_id');
		localStorage.removeItem('username');
		localStorage.removeItem('user_email');
		localStorage.removeItem('user_first_name');
		localStorage.removeItem('user_last_name');

		axiosInstance.defaults.headers['Authorization'] = null;

		navigate('/login');
	});

	return <div>Logout</div>;
}

export default Logout;