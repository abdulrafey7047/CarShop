import React, { useEffect } from 'react'; 
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom';

import Advertisments from './components/Advertisments'
import AdvertismentLoadingComponent from './components/AdvertismentLoading'

import sagaActions from './app/sagaActions';
import axiosInstance from './custom_axios';
import { setAdvertisments } from './redux-slices/advertismentSlice';

import './App.css'


function App() {

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch({ type: sagaActions.FETCH_ADVERTISMENT_SAGA, payload: {'filterString': '/'} })
		dispatch({ type: sagaActions.FETCH_CATEGORIES_SAGA })
	}, []);

	const isLoading = useSelector((state) => state.adds.isLoading)

	const [searchParams, setSearchParams] = useSearchParams();
    const query_param = searchParams.get("category")
	if (query_param){
		axiosInstance.get(`/advertisments?category=${query_param}`).
            then((response) => {
                dispatch(setAdvertisments(response))
            }).
            catch((error) => {
                console.log(error)
            })
    }

	return (
		<div className='App'>
			{isLoading && <AdvertismentLoadingComponent />}
			{!isLoading && <Advertisments /> }
		</div>
	);
}

export default App;
