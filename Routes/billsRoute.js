const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const Router = express.Router();
const Redis = require("ioredis");
const redis = new Redis();


async function getBills(customerID) {
    const bill = await prisma.bills.findMany({
        where: {
            customerId: customerID
        }
    })
    return bill
}
async function getUserID(username) {
    const user = await prisma.customer.findFirst({
        where: {
            username: username
        }
    })
    return user.id
}
async function addBills(bill) {
    const addedBill = await prisma.bills.create({
        data: bill
    })
    return addedBill
}
async function getUser(userSessionID) {
    const res = await redis.get(userSessionID, (err, result) => {
        return result
    });
    return JSON.parse(res)
};

Router.get('/home', async (req, res) => {
    const usersession = "sess:" + req.query.sessionID;

    const response = await getUser(usersession)
    const customerID = await getUserID(response.userid);
    const bills = await getBills(customerID);

    res.send(bills)
})

Router.post('/addBill', async (req, res) => {
    const usersession = "sess:" + req.body.userID;
    const response = await getUser(usersession);
    const username = response.userid
    const userid = await getUserID(username)
    const bill = req.body.bill
    bill.customerId = userid;
    const confirmation = await addBills(bill)
    res.send(confirmation)
})

module.exports = Router;