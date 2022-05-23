
import './App.css';
import LoginForm from './components/loginform';
import axios from 'axios';
function App() {
  const Login = loginDetails => {
    axios.post("http://localhost:3002/login", loginDetails).then((res) => {
      console.log(res)
    })
  }
  return (
    <div className="App">
      <LoginForm Login={Login} />
    </div>
  );
}

export default App;
