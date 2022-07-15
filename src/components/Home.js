import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Bill from "./Bill";
import CreateBill from "./CreateBill";
import Navbar from "./Navbar";

export default function Home({ logout }) {
  const navigate = useNavigate();
  const url = "http://localhost:3002";

  const [userBills, setUserBills] = useState([]);
  const handleDeleteBill = async (bill) => {
    const removeBill = bill.id;

    axios
      .delete(`${url}/bills`, {
        data: { billID: bill.id },
      })
      .then((res) => {
        res.status === 200
          ? setUserBills(
              userBills.filter((bill) => {
                return bill.id !== removeBill;
              })
            )
          : console.log("unsuccessful");
      });
  };
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
      <Navbar logout={logout} />
      <>
        {userBills.length > 0
          ? userBills.map((bill) => {
              return (
                <Bill
                  key={bill.id}
                  bill={bill}
                  //url={url}
                  deleteBill={handleDeleteBill}
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
