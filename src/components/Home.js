import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bill from "./Bill";
import CreateBill from "./CreateBill";
import Navbar from "./Navbar";

export default function Home({ onClick }) {
  const url = "http://localhost:3002";
  const handleDeleteBill = async (bill) => {
    axios
      .delete(`${url}/bill`, {
        data: { billID: bill.id },
      })
      .then(console.log("success"));
  };
  const [userBills, setUserBills] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBills = async () => {
      await axios.get("http://localhost:3002/bills").then((res) => {
        res.status === 200 ? setUserBills(res.data) : navigate("/login");
      });
    };
    fetchBills();
  }, []);
  return (
    <div className="home">
      <Navbar />
      <>
        {userBills.length > 0
          ? userBills.map((bill) => {
              return (
                <Bill
                  key={bill.id}
                  bill={bill}
                  url={url}
                  onClick={handleDeleteBill}
                />
              );
            })
          : "No Bills to Show"}
      </>
      <CreateBill
        onClick={() => {
          navigate("/createbill");
        }}
      />
    </div>
  );
}
