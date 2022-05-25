
const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router(); //creates a new instance of a router object
const crypto = require("crypto");

const generatePassword = (password) => {
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
    const res = await prisma.customer.create({
        data: customerDetails
    });
    console.log(res)
    return res

}
router.get('/allUsers', async (req, res) => {
    //console.log(await getAllCustomers());
    res.send(await getAllCustomers())

})

router.post('/newUser', async (req, res) => {
    const passwordData = generatePassword(req.body.password);
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

module.exports = router;
