const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const billsRoute = require("./Routes/billsRoute");
const { router: authRoute } = require("./Routes/authRoute");
const client = require("./helpers/init_redis");
const RedisStore = require("connect-redis")(session);
const passport = require("passport");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

require("dotenv").config({ path: "./.env" });

app.use(
  session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60, // * 24,
      httpOnly: false,
    },
    store: new RedisStore({ client: client }),
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  const { url } = req;
  const isCookieSent = req.headers.cookie;
  console.log({ url });
  console.log({ isCookieSent });
  next();
});

app.use(authRoute);
app.use(userRoutes);
app.use(billsRoute);

app.listen(process.env.PORT || 3002, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
