import axios from "axios";
import "./index.css";

import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Preferences from "./components/Preferences";

import BrandLogo from "./components/BrandLogo";

import FormUpdateBill from "./components/FormUpdateBill";
import FormSignup from "./components/FormSignup";
import Cookies from "js-cookie";

import LoginForm from "./components/Loginform";
import LandingPage from "./components/LandingPage";

import Home from "./components/Home";
import Protected from "./components/Protected";
import FormCreateBill from "./components/FormCreateBill";

function App() {
  axios.defaults.withCredentials = true;
  const [isLoggedIn, setisLoggedIn] = useState(null);
  let navigate = useNavigate();
  const Login = async (loginDetails) => {
    try {
      await axios
        .post("http://localhost:3002/auth/login", loginDetails, {
          credentials: "same-origin",
        })
        .then((res) => {
          if (res.status === 200) {
            setisLoggedIn(true);
            navigate("/home");
          } else {
            setisLoggedIn(false);
            navigate("/login");
          }
        });
    } catch (error) {
      navigate("/login");
    }
  };
  const Logout = async () => {
    try {
      setisLoggedIn(false);
      Cookies.remove("connect.sid", { path: "/" });
      await axios.get("http://localhost:3002/auth/logout").then((res) => {
        navigate("/");
      });
    } catch (error) {
      navigate("/login");
    }
  };
  const Signup = async (userData) => {
    try {
      await axios.post("http://localhost:3002/signup", userData).then((res) => {
        res.status === 200 ? navigate("/login") : navigate("/");
      });
    } catch (error) {
      navigate("/");
    }
  };
  return (
    <div className="wrapper">
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <Home onClick={Logout} />
            </Protected>
          }
        />
        <Route
          path="/createbill"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <FormCreateBill onClick={Logout} />
            </Protected>
          }
        />
        <Route
          path="/editbill"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <FormUpdateBill onClick={Logout} />
            </Protected>
          }
        />
        <Route
          path="/preferences"
          element={
            <Protected isLoggedIn={isLoggedIn}>
              <Preferences onClick={Logout} />
            </Protected>
          }
        />
        <Route path="/login" element={<LoginForm Login={Login} />} />
        <Route path="/signup" element={<FormSignup onClick={Signup} />} />
      </Routes>
    </div>
  );
}

export default App;
