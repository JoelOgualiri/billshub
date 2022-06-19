const client = require("../helpers/init_redis")

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        console.log(req.session)
        next()
    } else {
        res.send("You are not authenticated!")
    }
}
const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next()
    } else {

        res.send("You are not authorised!")
    }
}

module.exports = { isAdmin, isAuth }