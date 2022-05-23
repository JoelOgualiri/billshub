const express = require("express");
const app = express();
const sessions = require('express-session');
const cors = require("cors");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require('crypto');
var session = {};

const customerRoutes = require('./Routes/customerRoutes');
const loginRoute = require('./Routes/loginRoute');

require('dotenv').config()
app.use(express.json());
app.use(cors());


app.use(loginRoute);
app.use(customerRoutes);

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
app.use(sessions({
    key: 'session_cookie_name',
    secret: process.env.secret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    resave: false,
    saveUninitialized: true
}));

passport.use(new LocalStrategy(async function verify(username, password, done) {
    //console.log(password)
    const user = await prisma.customer.findUnique({
        where: {
            username: username
        }
    })
    if (!user) {
        return done(null, false, {
            message: 'Incorrect username or password'
        })
    }
    //console.log(user)
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', (err, hashedPassword) => {
        if (err) {
            return done(err)
        }
        if (user.hashed_password !== hashedPassword.toString('hex')) {
            console.log(hashedPassword.toString('hex'))
            return done(null, false, { message: "Incorrect username or password" });
        }
        return done(null, user);
    })
}));
//Create User


//Login User

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/access'
}), (req, res) => {
    session[req.body.username] = req.session;

    //session.userid = req.body.username;
    //console.log(req.sessionID)
    console.log(session);
    res.send("successful login")
}
);
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})