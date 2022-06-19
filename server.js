const express = require("express");
const app = express();
const session = require('express-session');
const cors = require("cors");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require('crypto');
const { isAuth, isAdmin } = require("./Routes/authRoute")
const client = require('./helpers/init_redis')


let RedisStore = require("connect-redis")(session)

const customerRoutes = require('./Routes/customerRoutes');
const billsRoute = require('./Routes/billsRoute');

require('dotenv').config();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))


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
    key: 'sessionID',
    secret: process.env.secret,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: false
    },
    store: new RedisStore({ client: client }),
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
            //console.log(hashedPassword.toString('hex'))
            return done(null, false, { message: "Incorrect username or password" });
        }
        return done(null, user);
    })
}));

app.post('/login', passport.authenticate('local'), (req, res) => {
    req.session.userid = req.body.username;
    req.session.isAuth = true
    req.session.isAdmin = req.session.passport.user.role === 'ADMIN' ? true : false
    //console.log(req.session.cookie)
    //const sess = req.session;
    //res.set('Set-Cookie', `session=${req.sessionID}`)
    //res.cookie('session_id', req.sessionID, { maxAge: 900000, httpOnly: false, secure: true })
    //res.send(200);
    //console.log(res)
    //res.send
    res.send(req.sessionID);
}
);
app.get('/logout', isAuth, isAdmin, (req, res) => {
    console.log(req.session);
    req.session.destroy();
    res.sendStatus(200)
})

app.listen(process.env.PORT || 3002, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

//module.exports = redisClient