const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Router = express.Router();
const Redis = require("ioredis");
const redis = new Redis();
const moment = require("moment");

const getUserID = async (username) => {
    const user = await prisma.customer.findFirst({
        where: {
            username: username
        }
    })
    return user.id
}
const getSession = async (userSessionID) => {
    const userData = await redis.get(userSessionID, (error, result) => {
        return result
    });
    return JSON.parse(userData)
};
const getBills = async (customerID) => {
    const bill = await prisma.bills.findMany({
        where: {
            customerId: customerID
        }
    })
    return bill
}
const deleteBills = (customerID) => {
    prisma.bills.deleteMany({
        where: {
            customerId: customerID,
        },
    })
}
const addBill = async (bill) => {
    const addedBill = await prisma.bills.create({
        data: bill
    })
    return addedBill
}
const updateBill = async (billID, data) => {
    await prisma.bills.update({
        where: {
            id: Number(billID)
        },
        data: data
    })
}

const convertDueDate = (bills) => {
    let newBills = bills.map((bill) => {
        return ({ ...bill, due_date: bill.due_date ? moment(bill.due_date).format('LL') : "No Due Date" })
    })
    return newBills
}

Router.get('/', async (req, res) => {
    const userSessionID = "sess:" + req.query.sessionID;
    const response = await getSession(userSessionID)
    if (!response) {
        res.status(403)
        console.log("No session found")
        res.send("No session found")
        return
    }
    console.log(response)
    const customerID = await getUserID(response.userid);
    let bills = await getBills(customerID);
    bills = convertDueDate(bills)
    res.send(bills)
})

Router.post('/bill', async (req, res) => {
    const userSessionID = "sess:" + req.body.userID;
    const userData = await getSession(userSessionID);
    const username = userData.userid;
    const userid = await getUserID(username);
    const bill = req.body.bill;
    bill.customerId = userid;
    bill.amount = parseFloat(bill.amount);
    bill.end_date = moment(bill.end_date).format();
    bill.repeat = bill.repeat === 'true' ? true : false;
    const newBill = await addBill(bill);
    res.send(newBill);
})

Router.put('/bill/:billID', async (req, res) => {
    const usersessionID = "sess:" + req.body.sessionID;
    const session = await getSession(usersessionID);
    console.log(req.params.billID)
    if (!session) {
        res.statusCode = 403;
        return [];
    }
    try {
        await updateBill(req.params.billID, req.body.data);

    } catch (error) {
        console.error(error);
        return []
    }
    res.send("success");
})

module.exports = Router;
//module.exports = deleteBills;