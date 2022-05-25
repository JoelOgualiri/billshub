const express = require("express");
const app = express();
const session = require('express-session');
const cors = require("cors");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require('crypto');
//setup redis
const redis = require('redis');
let RedisStore = require("connect-redis")(session)
const { createClient } = require("redis")
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

const customerRoutes = require('./Routes/customerRoutes');
const billsRoute = require('./Routes/billsRoute');
var sess = {};

require('dotenv').config();

app.use(express.json());
app.use(cors());

//Routes
app.use(customerRoutes);
app.use(billsRoute);


passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
app.use(session({
    key: 'connect.sid',
    secret: process.env.secret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    // create new redis store.
    store: new RedisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: true
}));

passport.use(new LocalStrategy(async function verify(username, password, done) {
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

app.post('/login', passport.authenticate('local'), (req, res) => {
    req.session.userid = req.body.username;
    const sess = req.session;
    res.send(req.sessionID);
}
);
app.get('/logout', (req, res) => {
    console.log(req.session)
    req.session.destroy();
    res.redirect('/login')
})
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

module.exports = redisClient