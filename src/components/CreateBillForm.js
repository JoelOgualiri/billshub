import React from 'react'
import { useState, useRef } from 'react';
import axios from 'axios';
import moment from 'moment'

export default function CreateBillForm({ sessionID }) {
    const selectValue = useRef()
    const today = String(moment(new Date().toLocaleDateString('en-ca')).format("YYYY-MM-DDThh:mm"));
    const session_ID = sessionID;
    const [bill, setBill] = useState([]);

    const createBill = async (bill) => {
        var response
        await axios.post("http://localhost:3002/addBill", { userID: session_ID, bill: bill }).then((res) => {
            response = res.data
        })
        return response
    }

    const submitHandler = (event) => {
        event.preventDefault()
        console.log(selectValue.current.value)
        console.log(bill)
        createBill(bill, session_ID)
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <div>
                    <h2>
                        Add a new Bill
                    </h2>
                    <div>
                        <label for="name">Name</label>
                        <input type="text" value={bill.name} onChange={e => setBill({ ...bill, name: e.target.value })}></input>
                    </div>
                    <div>
                        <label for="amount">Amount</label>
                        <input type="number" step="0.01" min="0" value={bill.amount} onChange={e => setBill({ ...bill, amount: e.target.value })}></input>
                    </div>
                    <div>
                        <label for="duedate">Due date</label>
                        <input type="datetime-local" value={bill.due_date} min={today} onChange={e => setBill({ ...bill, due_date: e.target.value })} />

                    </div>
                    <div>
                        <label for="reoccuring">Reoccuring?</label>
                        <select ref={selectValue} name="reoccuring" onChange={e => setBill({ ...bill, reoccuring: e.target.value })}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </select>
                    </div>
                    <input type="submit"></input>
                </div>
            </form>
        </div>
    )
}
