import React from 'react'

export default function Bill({ bill }) {
    return (
        <>
            <h1>{bill.name}</h1>
            <h1>{bill.amount}</h1>
            <h1>{bill.due_date}</h1>
        </>
    )
}
