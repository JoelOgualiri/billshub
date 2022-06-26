const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const Redis = require("ioredis");
const redis = new Redis();
const moment = require("moment");
const { isAdmin, isAuth } = require("./authRoute");

const getUserId = async (username) => {
  const user = await prisma.customer.findFirst({
    where: {
      username: username,
    },
  });
  return user.id;
};
const createBill = async (bill) => {
  try {
    const newBill = await prisma.bills.create({
      data: bill[0],
    });
    return newBill;
  } catch (error) {
    return { error: "Server error! request not fulfilled" };
  }
};
const userBills = async (userId) => {
  try {
    const bill = await prisma.bills.findMany({
      where: {
        customerId: userId,
      },
    });
    return bill;
  } catch (error) {
    return { error: "Server error! request not completed" };
  }
};
const updateBill = async (billId, bill, userid) => {
  try {
    const updatedBill = await prisma.bills.updateMany({
      where: {
        id: Number(billId),
        customerId: userid,
      },

      data: bill[0],
    });
    if (updatedBill.count === 0) {
      return { error: "Bill doesnt exist! request not fulfilled!" };
    }
    return updatedBill;
  } catch (error) {
    return { error: "Server error! request not fulfilled!" };
  }
};
const getAllBills = async () => {
  try {
    const bills = await prisma.bills.findMany();
    return bills;
  } catch (error) {
    return { error: "Server error! request not completed" };
  }
};
const deleteBill = async (billID, userid) => {
  try {
    const deletedBill = await prisma.bills.deleteMany({
      where: {
        id: billID,
        customerId: userid,
      },
    });
    if (deletedBill.count === 0) {
      return { error: "Bill doesnt exist! request not fulfilled!" };
    }
    return deletedBill;
  } catch (error) {
    return { error: "Server error! request not fulfilled!" };
  }
};
const convertDateClient = (bills) => {
  let newBills = bills.map((bill) => {
    return {
      ...bill,
      due_date: bill.due_date
        ? moment(bill.due_date).format("LL")
        : "No Due Date",
      end_date: bill.end_date ? moment(bill.end_date).format("LL") : null,
    };
  });
  return newBills;
};
const convertDateDB = (bills) => {
  let newBills = bills.map((bill) => {
    return {
      ...bill,
      due_date: bill.due_date ? moment(bill.due_date).format() : null,
      end_date: bill.end_date ? moment(bill.end_date).format() : null,
    };
  });
  return newBills;
};
const getSession = async (userSessionID) => {
  const userData = await redis.get(userSessionID, (error, result) => {
    return result;
  });
  return JSON.parse(userData);
};
const deleteAllUserBills = async (userID) => {
  const deletedBills = await prisma.bills.deleteMany({
    where: {
      customerId: userID,
    },
  });
  return deletedBills;
};

const validateBill = (bill) => {
  //check properties about a bill to see if its a valid
  if (bill.repeat) {
    console.log(true);
  }
  //1. update the current month and year of each bill
  //1. check if repeat is true
  //2. if repeat is true, check if the due date is less than the end_date

  return;
};
router.get("/bills", isAuth, async (req, res) => {
  const userid = await getUserId(req.user.username);
  let bills = await userBills(userid);
  if (!bills.error) {
    bills = convertDateClient(bills);
    res.status(200).json(bills);
  } else {
    res.status(500).json({ message: bills.error });
  }
});
router.post("/bill", isAuth, async (req, res) => {
  const userid = await getUserId(req.user.username);
  let bill = req.body.bill;
  bill.customerId = userid;
  bill.amount = parseFloat(bill.amount);
  if (bill.end_date) {
    bill.end_date = moment(bill.end_date).format();
  }
  bill = convertDateDB([bill]);
  const newBill = await createBill(bill);
  if (!newBill.error) {
    res.status(200).json({ message: "Bill successfully created!" });
  } else {
    res.status(500).json({ message: newBill.error });
  }
});
router.put("/bill", isAuth, async (req, res) => {
  const userid = await getUserId(req.user.username);
  const billId = req.body.billID;
  if (req.body.bill.amount) {
    req.body.bill.amount = parseFloat(req.body.bill.amount);
  }
  let bill = convertDateDB([req.body.bill]);
  const updatedBill = await updateBill(billId, bill, userid);
  if (!updatedBill.error) {
    res.status(200).json({ message: "Bill updated successfully!" });
  } else {
    res.status(500).json({ message: updatedBill.error });
  }
});
router.get("/admin/bills", isAdmin, async (req, res) => {
  const allBills = await getAllBills();
  if (!allBills.error) {
    res.status(200).json(allBills);
  } else {
    res.status(500).json({ message: allBills.error });
  }
});
router.delete("/bill", async (req, res) => {
  const userid = await getUserId(req.user.username);
  const billId = req.body.billID;
  const deletedBill = await deleteBill(billId, userid);
  if (!deletedBill.error) {
    res.status(200).json({ message: "Bill deleted successfully!" });
  } else {
    res.status(500).json({ message: deletedBill.error });
  }
});

module.exports = router;
