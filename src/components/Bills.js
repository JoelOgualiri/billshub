import axios from "axios";
import { useState, useEffect } from "react";
import Bill from "./Bill";
import { CreateBill } from "./CreateBill";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

export default function Bills({ sessionID, onClick }) {
  const navigate = useNavigate();
  const session_ID = sessionID;
  const [userBills, setUserBills] = useState([]);
  //axios.defaults.withCredentials = true;
  const getBills = async () => {
    await axios.get("http://localhost:3002/bills").then((res) => {
      console.log(res);
      setUserBills(res.data);
    });
  };
  const navigateToCreateBill = () => {
    navigate("/createbill");
  };
  useEffect(() => {
    const fetchBills = async () => {
      await getBills();
    };
    fetchBills();
  }, []);
  return (
    <div className="billDisplay">
      <Button onClick={onClick} text="Signout" />
      {userBills.length > 0
        ? userBills.map((bill) => {
            return <Bill key={bill.id} bill={bill} sessionID={session_ID} />;
          })
        : "No Bills to Show"}
      <CreateBill onClick={navigateToCreateBill} />
    </div>
  );
}
