
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

  const Login = loginDetails => {


    axios.post("http://localhost:3002/login", loginDetails).then((res) => {
      //console.log(res.data)
      setSessionID(res.data)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response.status)
      }
    })
  };
  const Logout = () => {
    sessionStorage.removeItem('sessionID')
    axios.get("http://localhost:3002/logout").then((res) => {
      //console.log(res.data)
      console.log("Logged out!")
      res.redirect('/login')
    })
  };

  const getBills = sessionID => {
    axios.get("http://localhost:3002/home", { params: { sessionID: sessionID } }).then((res) => {
      console.log(res.data)
      return res.data
    })
  }

  if (!sessionID) {
    return <LoginForm Login={Login} />
  }
  return (
    <div className="wrapper">
      <h1>Billshub</h1>
      <button onClick={Logout}>Logout</button>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home getBills={getBills(sessionID)} />} />
          <Route path="/preferences" element={<Preferences />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
