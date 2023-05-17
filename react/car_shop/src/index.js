import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux'

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import store from './app/store'

import Navbar from './components/Navbar';
import Login from './components/login';
import Register from './components/register';
import Logout from './components/Logout';
import AdvertismentDetail from './components/AdvertismentDetail';
import Profile from './components/Profile';
import ProfileUpdate from './components/ProfileUpdate';
import Home from './components/Home';
import AdvertismentCreate from './components/AdvertismentCreate';
import AdvertismentDelete from './components/AdvertismentDelete';
import AdvertismentUpdate from './components/AdvertismentUpdate';
import LiveCount from './components/LiveCount';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/profile/update" element={<ProfileUpdate />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/advertisments" element={<App />} />
            <Route path="/advertisments/:id" element={<AdvertismentDetail />} />
            <Route path="/advertisments/create" element={<AdvertismentCreate />} />
            <Route path="/advertisments/update/:id" element={<AdvertismentUpdate />} />
            <Route path="/advertisments/delete/:id" element={<AdvertismentDelete />} />
            <Route path="/count/" element={<LiveCount />} />
          </Routes>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
  
);

reportWebVitals();
