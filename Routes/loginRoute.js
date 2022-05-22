const express = require("express");
const router = express.Router(); //creates a new instance of a router object
const auth = require('../Middleware/auth')

router.post('/', (req, res) => {
    console.log("logged in")
    res.send('logged in')
})


module.exports = router;
