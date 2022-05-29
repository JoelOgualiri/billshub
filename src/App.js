import axios from 'axios';
import './index.css'
import React, { useState, useEffect } from 'react';
import LoginForm from './components/Loginform';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Preferences from './components/Preferences';
import Bills from './components/Bills';
import useSessionID from './components/useSessionID';
import CreateBillForm from './components/CreateBillForm';
import { BrandLogo } from './components/BrandLogo';
import { Button } from './components/Button';

function App() {
  const { sessionID, setSessionID } = useSessionID()
  const Login = async (loginDetails) => {
    try {
      await axios.post("http://localhost:3002/login", loginDetails).then((res) => {
        setSessionID(res.data)
      })
    } catch (error) {
      if (error.response) {
        console.log(error.response.status)
      }
    }
  };
  const Logout = async () => {
    sessionStorage.removeItem('sessionID')
    await axios.get("http://localhost:3002/logout").then((res) => {
      console.log("Logged out!")
      res.redirect('/login')
    })
  };

  if (!sessionID) {
    return <LoginForm Login={Login} />
  }
  return (
    <BrowserRouter>
      <div className="wrapper">
        <BrandLogo />
        <Button onClick={Logout} text="Signout" />
        <Routes>
          <Route path="/" element={<Bills sessionID={sessionID} />} />
          <Route path="/createbill" element={<CreateBillForm sessionID={sessionID} />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
