
import './App.css';
import LoginForm from './components/Login';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Preferences from './components/Preferences';
import Home from './components/Home';
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import useSessionID from './components/useSessionID';


function App() {
  const { sessionID, setSessionID } = useSessionID()
  console.log(sessionID)
  const Login = loginDetails => {
    axios.post("http://localhost:3002/login", loginDetails).then((res) => {
      console.log(res.data)
      setSessionID(res.data)

    })
  }
  if (!sessionID) {
    return <LoginForm Login={Login} />
  }
  return (
    <div className="wrapper">
      <h1>Billshub</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
