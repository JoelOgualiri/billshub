import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Bill from './Bill';
import { CreateBill } from './CreateBill';
import { BrandLogo } from './BrandLogo';

export default function Bills({ sessionID }) {
    const session_ID = sessionID;
    const [userBills, setUserBills] = useState([]);

    const getBills = async () => {
        await axios.get("http://localhost:3002/home", { params: { sessionID: session_ID } }).then((res) => {
            setUserBills(res.data)
        })
    }
    useEffect(() => {
        const fetchBills = async () => {
            await getBills()
        }
        fetchBills()
    }, [])
    return (
        <div>
            {userBills.length > 0 ? userBills.map(bill => { return (<Bill key={bill.id} bill={bill} />) }) : "No Bills to Show"}
            <CreateBill />
        </div>

    );
}