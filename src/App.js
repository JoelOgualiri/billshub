import axios from "axios";
import "./index.css";
import LoginForm from "./components/Loginform";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Preferences from "./components/Preferences";
import Bills from "./components/Bills";
import useSessionID from "./components/useSessionID";
import FormCreateBill from "./components/FormCreateBill";
import { BrandLogo } from "./components/BrandLogo";
import Button from "./components/Button";
import { FormUpdateBill } from "./components/FormUpdateBill";
import { FormSignup } from "./components/FormSignup";
import Cookies from "js-cookie";
import LandingPage from "./components/LandingPage";

function App() {
  axios.defaults.withCredentials = true;
  let navigate = useNavigate();
  const routeChange = () => {
    console.log("logged out");
    let path = `login`;
    navigate(path);
  };
  const { sessionID, setSessionID } = useSessionID();
  const Login = async (loginDetails) => {
    try {
      await axios
        .post("http://localhost:3002/auth/login", loginDetails, {
          credentials: "same-origin",
        })
        .then((res) => {
          res.status === 200 ? navigate("/home") : navigate("/login");
          setSessionID(res.data);
        });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
      }
    }
  };
  const Logout = async () => {
    try {
      sessionStorage.removeItem("sessionID");
      Cookies.remove("connect.sid", { path: "/" });
      await axios.get("http://localhost:3002/auth/logout").then((res) => {
        navigate("/");
      });
    } catch (error) {
      navigate("/");
      if (error.response) {
        console.log(error.response.status);
      }
    }
  };
  const Signup = async (userData) => {
    try {
      await axios.post("http://localhost:3002/signup", userData).then((res) => {
        console.log("sign up successful");
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
      }
    }
  };
  /*
  if (!sessionID) {
    if (window.location.pathname === "/signup") {
      return <FormSignup onClick={Signup} />;
    } else {
      return <LoginForm Login={Login} />;
    }
  }
  */
  return (
    <div className="wrapper">
      <BrandLogo />
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route
          exact
          path="/home"
          element={<Bills sessionID={sessionID} onClick={Logout} />}
        />
        <Route
          path="/createbill"
          element={<FormCreateBill sessionID={sessionID} onClick={Logout} />}
        />
        <Route path="/editbill" element={<FormUpdateBill onClick={Logout} />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/login" element={<LoginForm Login={Login} />} />
        <Route path="/signup" element={<FormSignup onClick={Signup} />} />
      </Routes>
    </div>
  );
}

export default App;
