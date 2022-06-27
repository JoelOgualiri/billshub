import { useState, useRef } from "react";
import axios from "axios";
import moment from "moment";
import Button from "./Button";
import Bills from "./Bills";

export default function FormCreateBill({ sessionID, onClick }) {
  const selectValueRepeat = useRef();
  const selectValueFrequency = useRef();
  const today = String(
    moment(new Date().toLocaleDateString("en-ca")).format("YYYY-MM-DDThh:mm")
  );
  const session_ID = sessionID;
  const [bill, setBill] = useState({ frequency: "monthly", repeat: false });

  const createBill = async (bill) => {
    var response;
    await axios
      .post("http://localhost:3002/bill", { bill: bill })
      .then((res) => {
        console.log(res);
        response = res.data;
      });
    return response;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    //console.log(selectValueRepeat.current.value)
    //console.log(selectValueFrequency.current.value)
    //console.log(bill)
    createBill(bill);
  };
  return (
    <div>
      <Button onClick={onClick} text="Signout" />
      <form onSubmit={submitHandler}>
        <div>
          <h2>Add a new Bill</h2>
          <div>
            <label for="name">Name</label>
            <input
              type="text"
              value={bill.name}
              onChange={(e) => setBill({ ...bill, name: e.target.value })}
            ></input>
          </div>
          <div>
            <label for="amount">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={bill.amount}
              onChange={(e) => setBill({ ...bill, amount: e.target.value })}
            ></input>
          </div>
          <div>
            <label for="due_date">Due date</label>
            <input
              type="datetime-local"
              value={bill.due_date}
              min={today}
              onChange={(e) => setBill({ ...bill, due_date: e.target.value })}
            />
          </div>
          <div>
            <label for="repeat">Repeat</label>
            <select
              ref={selectValueRepeat}
              name="repeat"
              defaultValue={false}
              onChange={(e) => setBill({ ...bill, repeat: e.target.value })}
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div style={{ visibility: bill.repeat ? "visible" : "hidden" }}>
            <label for="frequency">Frequency</label>
            <select
              ref={selectValueFrequency}
              name="frequency"
              defaultValue={"monthly"}
              onChange={(e) => setBill({ ...bill, frequency: e.target.value })}
            >
              <option value={"weekly"}>Weekly</option>
              <option value={"biweekly"}>BiWeekly</option>
              <option value={"monthly"}>Monthly</option>
              <option value={"yearly"}>Yearly</option>
            </select>
          </div>
          <div style={{ visibility: bill.repeat ? "visible" : "hidden" }}>
            <label for="end_date">End date</label>
            <input
              type="datetime-local"
              value={bill.end_date}
              min={today}
              onChange={(e) => setBill({ ...bill, end_date: e.target.value })}
            />
          </div>
          <input type="submit"></input>
        </div>
      </form>
    </div>
  );
}
