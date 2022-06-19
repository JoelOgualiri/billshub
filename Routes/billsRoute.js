const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Router = express.Router();
const Redis = require("ioredis");
const redis = new Redis();
const moment = require("moment");
const { isAdmin, isAuth } = require('./authRoute');


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
const getAllBills = async () => {
    const allBills = await prisma.bills.findMany()
    return allBills
}
const deleteAllUserBills = async (userID) => {
    const deletedBills = await prisma.bills.deleteMany({
        where: {
            customerId: userID,
        },
    })
    return deletedBills
}
const deleteBill = async (billID) => {
    const deletedBill = await prisma.bills.delete({
        where: {
            id: billID,
        },
    })
    return deletedBill
}
const addBill = async (bill) => {
    const addedBill = await prisma.bills.create({
        data: bill[0]
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

const convertDateClient = (bills) => {
    let newBills = bills.map((bill) => {
        return ({ ...bill, due_date: bill.due_date ? moment(bill.due_date).format('LL') : "No Due Date", end_date: bill.end_date ? moment(bill.end_date).format('LL') : null })
    })
    return newBills
}

const convertDateDB = (bills) => {
    let newBills = bills.map((bill) => {
        return ({ ...bill, due_date: bill.due_date ? moment(bill.due_date).format() : null, end_date: bill.end_date ? moment(bill.end_date).format() : null })
    })
    return newBills
}

const validateBill = (bill) => {
    //check properties about a bill to see if its a valid
    if (bill.repeat) {
        console.log(true)
    }
    //1. update the current month and year of each bill
    //1. check if repeat is true
    //2. if repeat is true, check if the due date is less than the end_date

    return
}
Router.get('/', async (req, res) => {
    const userSessionID = 'sess:' + req.query.sessionID;
    const response = await getSession(userSessionID);
    if (!response) {
        res.status(403);
        console.log("No session found");
        res.send("No session found");
        return
    }
    const customerID = await getUserID(response.userid);
    let bills = await getBills(customerID);

    bills.map((bill) => validateBill(bill));

    bills = convertDateClient(bills);
    res.send(bills)
})

Router.post('/bill', async (req, res) => {
    const userSessionID = "sess:" + req.body.userID;
    const userData = await getSession(userSessionID);
    const username = userData.userid;
    const userid = await getUserID(username);
    let bill = req.body.bill;
    bill.customerId = userid;
    bill.amount = parseFloat(bill.amount);
    bill.end_date = moment(bill.end_date).format();
    console.log(bill)
    bill = convertDateDB([bill])
    const newBill = await addBill(bill);
    res.send(bill)
    //res.send(newBill);
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

Router.get('/allBills', async (req, res) => {
    const allBills = await getAllBills();
    res.send(allBills)
})
Router.delete('/bill', async (req, res) => {
    const usersessionID = "sess:" + req.headers.authorization;
    console.log(req)
    const session = await getSession(usersessionID);
    const billID = req.body.billID;
    if (!session) {
        res.statusCode = 403;
        return [];
    }
    try {
        await deleteBill(billID);

    } catch (error) {
        console.error(error);
        return []
    }
    res.send("success");
})

module.exports = Router;
//module.exports = deleteBills;