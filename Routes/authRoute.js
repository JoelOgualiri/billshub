const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const crypto = require("crypto");

async function authUser(username, password, done) {
  const user = await prisma.customer.findUnique({
    where: {
      username: username,
    },
  });
  if (!user) {
    return done(null, false, {
      message: "User not in database",
    });
  } else if (user) {
    crypto.pbkdf2(
      password,
      user.salt,
      310000,
      32,
      "sha256",
      (err, hashedPassword) => {
        if (err) {
          return done(err);
        }
        if (user.hashed_password !== hashedPassword.toString("hex")) {
          //console.log(hashedPassword.toString('hex'))
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
        return done(null, user);
      }
    );
  }
}
passport.serializeUser(function (authenticatedUser, done) {
  done(null, authenticatedUser.username);
});
passport.deserializeUser(async function (authenticatedUsername, done) {
  try {
    const user = await prisma.customer.findUnique({
      where: {
        username: authenticatedUsername,
      },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(new LocalStrategy(authUser));

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "You are not authenticated!" });
  }
};
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: "You are not authorised!" });
  }
};
const checkLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (req.session.isAuth) {
    return res.status(400).json({ error: "User already logged in" });
  }
  next();
};
const generateHashedPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("base64");
  const iterations = 310000;
  const keylen = 32;
  const digest = "sha256";
  const hashed_password = crypto
    .pbkdf2Sync(password, salt, iterations, keylen, digest)
    .toString("hex");
  return {
    salt: salt,
    hashed_password: hashed_password,
    iterations: iterations,
  };
};
async function createCustomer(customerDetails) {
  const user = await prisma.customer.findMany({
    where: {
      OR: [
        {
          username: customerDetails.username,
        },
        {
          email: customerDetails.email,
        },
      ],
    },
  });
  if (!user) {
    const res = await prisma.customer.create({
      data: customerDetails,
    });
    return res;
  } else if (customerDetails.username === user[0].username) {
    return { error: "username already taken!" };
  } else {
    return { error: "account exists, please log in!" };
  }
}

router.get("/auth/login", (req, res) => {
  res.send("pls log in, redirect to login page");
});
router.post("/auth/signup", async (req, res) => {
  const passwordData = generateHashedPassword(req.body.password);
  const customerDetails = {
    username: req.body.username,
    hashed_password: passwordData.hashed_password,
    salt: passwordData.salt,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    role: req.body.role,
    city: req.body.city,
    country: req.body.country,
  };
  try {
    const createdUser = await createCustomer(customerDetails);
    if (!createdUser.error) {
      res.status(200).json({ message: "User created successfully!" });
    } else {
      res.status(500).json({ message: createdUser.error });
    }
  } catch (error) {
    res.status(500).json({ message: "server error, user not created!" });
  }
});
router.post(
  "/auth/login",
  checkLoggedIn,
  passport.authenticate("local"),
  (req, res) => {
    req.session.userid = req.user.username;
    req.session.isAuth = req.isAuthenticated();
    req.session.isAdmin = req.user.role === "ADMIN" ? true : false;
    res.status(200).json({ message: "Successfully logged in!" });
  }
);
router.get("/auth/logout", isAuth, (req, res) => {
  //req.logOut();
  //delete (req.session.isAuth);
  //delete (req.session.userid);
  //delete (req.session.isAdmin);
  req.session.destroy();
  res.status(200).json({ message: "Successfully logged out!" });
});

module.exports = { isAuth, isAdmin, router };
