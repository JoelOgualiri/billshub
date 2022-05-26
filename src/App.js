
import './App.css';
import LoginForm from './components/Login';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Preferences from './components/Preferences';
import BillCard from './components/BillCard';
import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import useSessionID from './components/useSessionID';



function App() {
  const { sessionID, setSessionID } = useSessionID()

  const Login = loginDetails => {
    axios.post("http://localhost:3002/login", loginDetails).then((res) => {
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
      console.log("Logged out!")
      res.redirect('/login')
    })
  };
  const getBills = async (sessionID) => {
    var response
    await axios.get("http://localhost:3002/home", { params: { sessionID: sessionID } }).then((res) => {
      response = res.data
    })

    return response
  }
  const BillDisplay = () => {
    const [bills, setBills] = useState([]);
    useEffect(() => {
      async function fetchBills() {
        try {
          const userBills = await getBills(sessionID)
          setBills(userBills.map(bill => {
            return <BillCard key={bill.id} {...bill} />
          }))
        } catch (err) {
          console.log(err);
        }
      }
      fetchBills();
    }, [])
    return (
      <div>
        <section className="card--list">
          {bills}
        </section>

      </div>
    )

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
          <Route path="/home" element={<BillDisplay />} />
          <Route path="/preferences" element={<Preferences />} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
