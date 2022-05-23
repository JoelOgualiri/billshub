import React, { useState } from 'react';

function LoginForm() {
    const [details, setDetails] = useState({ username: '', password: '' });
    const submitHandler = e => {
        e.preventDefault();
        console.log(details)
    }
    return (
        <form onSubmit={submitHandler}>
            <div>
                <h2>
                    Welcome, login to manage your bills
                </h2>
                <div>
                    <label>Username</label>
                    <input onChange={e => setDetails({ ...details, username: e.target.value })}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={e => setDetails({ ...details, password: e.target.value })}></input>
                </div>
                <input type="submit"></input>
            </div>
        </form>
    )
}

export default LoginForm