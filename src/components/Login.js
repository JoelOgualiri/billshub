import React, { useState } from 'react';

export default function Login({ Login }) {
    const [loginDetails, setloginDetails] = useState({ username: '', password: '' });
    const submitHandler = e => {
        e.preventDefault();
        Login(loginDetails)
    }
    return (
        <form onSubmit={submitHandler}>
            <div>
                <h2>
                    Welcome, login to manage your bills
                </h2>
                <div>
                    <label>Username</label>
                    <input onChange={e => setloginDetails({ ...loginDetails, username: e.target.value })}></input>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" onChange={e => setloginDetails({ ...loginDetails, password: e.target.value })}></input>
                </div>
                <input type="submit"></input>
            </div>
        </form>
    )
}

