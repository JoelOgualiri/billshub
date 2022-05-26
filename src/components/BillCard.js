import React from 'react';
import axios from 'axios';

export default function BillCard(props) {
    console.log(props)
    return (
        <div className="card" style={{ backgroundColor: `${props.remindColor}` }}>
            <div className="card--price">
                <p>{props.currency}{props.amount}</p>
            </div>
            <div className="card--title">{props.name}</div>

        </div>



    );
}