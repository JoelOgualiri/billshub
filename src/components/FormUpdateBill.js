
import { useLocation } from 'react-router-dom';
import { useState, useRef } from 'react';
import Button from './Button'
import axios from 'axios';
import moment from 'moment';

export const FormUpdateBill = ({ onClick }) => {
    const url = "http://localhost:3002";
    const location = useLocation();
    const selectValueRepeat = useRef();
    const selectValueFrequency = useRef();
    const today = String(moment(new Date().toLocaleDateString('en-ca')).format("YYYY-MM-DDThh:mm"));
    const sessionID = location.state.sessionID;

    const [bill, setBills] = useState({
        due_date: location.state.bills.due_date || '',
        amount: location.state.bills.amount,
        name: location.state.bills.name,
        frequency: location.state.bills.frequency,
        repeat: location.state.bills.repeat,
        end_date: location.state.bills.end_date
    })
    const handleUpdateBill = async () => {
        console.log(sessionID)
        axios.put(`${url}/bill`, { data: { billID: location.state.bills.id, bill: bill }, headers: { "Authorization": location.state.sessionID } }).then(
            console.log("success")
        )
    };
    const submitHandler = (event) => {
        event.preventDefault()
        handleUpdateBill(bill);
    }
    return (
        <div className='updateBillsForm'>
            <Button onClick={onClick} text="Signout" />
            <form onSubmit={submitHandler}>
                <div>
                    <h2>
                        Edit this bill
                    </h2>
                    <div>
                        <label for="name">Name</label>
                        <input type="text" value={bill.name} onChange={e => setBills({ ...bill, name: e.target.value })}></input>
                    </div>
                    <div>
                        <label for="amount">Amount</label>
                        <input type="number" step="0.01" min="0" value={bill.amount} onChange={e => setBills({ ...bill, amount: e.target.value })}></input>
                    </div>
                    <div>
                        <label for="due_date">Due date</label>
                        <input type="datetime-local" value={bill.due_date} min={today} onChange={e => setBills({ ...bill, due_date: e.target.value })} />

                    </div>
                    <div>
                        <label for="repeat">Repeat</label>
                        <select ref={selectValueRepeat} name="repeat" defaultValue={false} onChange={e => setBills({ ...bill, repeat: e.target.value })}>
                            <option value={true} >Yes</option>
                            <option value={false} >No</option>
                        </select>
                    </div>
                    <div style={{ visibility: bill.repeat ? 'visible' : 'hidden' }} >
                        <label for="frequency" >Frequency</label>
                        <select ref={selectValueFrequency} name="frequency" defaultValue={"monthly"} onChange={e => setBills({ ...bill, frequency: e.target.value })}>
                            <option value={"weekly"} >Weekly</option>
                            <option value={"biweekly"}>BiWeekly</option>
                            <option value={"monthly"} >Monthly</option>
                            <option value={"yearly"}>Yearly</option>
                        </select>
                    </div>
                    <div style={{ visibility: bill.repeat ? 'visible' : 'hidden' }}>
                        <label for="end_date">End date</label>
                        <input type="datetime-local" value={bill.end_date} min={today} onChange={e => setBills({ ...bill, end_date: e.target.value })} />

                    </div>
                    <input type="submit"></input>
                </div>
            </form>

        </div>
    )
}
