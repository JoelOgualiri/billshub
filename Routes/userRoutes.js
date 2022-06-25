
const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router(); //creates a new instance of a router object
const crypto = require("crypto");
const deleteBills = require('./billsRoute');
const { isAdmin, isAuth } = require('./authRoute')

const generateHashedPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('base64');
    const iterations = 310000;
    const keylen = 32;
    const digest = 'sha256';
    const hashed_password = crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex')
    return {
        salt: salt,
        hashed_password: hashed_password,
        iterations: iterations
    };
};

async function getAllCustomers() {
    const res = await prisma.customer.findMany();
    //console.log(res)
    return res
}
async function createCustomer(customerDetails) {
    const user = await prisma.customer.findFirst({
        where: {
            username: customerDetails.email
        }

    })
    if (!user) {
        const res = await prisma.customer.create({
            data: customerDetails
        });
        return res
    } else {
        res.send("user already exists")
    }
}

router.get('/allUsers', isAuth, isAdmin, async (req, res) => {
    //console.log(await getAllCustomers());
    console.log(req)
    res.send(await getAllCustomers())

})
router.post('/signup', async (req, res) => {
    const passwordData = generateHashedPassword(req.body.password);
    const customerDetails = {
        "username": req.body.username,
        "hashed_password": passwordData.hashed_password,
        "salt": passwordData.salt,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "email": req.body.email,
        "role": req.body.role,
        "city": req.body.city,
        "country": req.body.country,
    }
    res.send(createCustomer(customerDetails))
})
router.delete('/admin/customer/account/:id', isAuth, isAdmin, async (req, res) => {
    const customerID = Number(req.params.id)
    console.log(customerID)
    const deleteCustomer = prisma.customer.delete({
        where: {
            id: customerID,
        },
    })
    const transaction = await prisma.$transaction([deleteBills(customerID), deleteCustomer])
    res.send(transaction)
})

module.exports = router;
