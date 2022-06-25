const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const { isAdmin, isAuth } = require("./authRoute");
const e = require("express");

async function getAllUsers() {
  try {
    const res = await prisma.customer.findMany();
    return res;
  } catch (error) {
    return { error: "Server error! request not completed" };
  }
}
async function getUser(userid) {
  try {
    const user = await prisma.customer.findUnique({
      where: {
        id: Number(userid),
      },
    });
    if (user) {
      return user;
    } else {
      return { error: "No user found!" };
    }
  } catch (error) {
    return { error: "Server error!" };
  }
}
async function deleteUser(userid) {
  try {
    const user = getUser(userid);
    if (!user) {
      return { error: "User does not exist" };
    }
    const deletedUser = prisma.customer.delete({
      where: {
        id: userid,
      },
    });
    return deletedUser;
  } catch (error) {
    return { error: "Server error! Request not completed" };
  }
}
async function updateUser(userid, data) {
  try {
    const user = getUser(userid);
    if (!user) {
      return { error: "User does not exist" };
    }
    const updatedUser = await prisma.customer.update({
      where: {
        id: Number(userid),
      },
      data: data[0],
    });
    return updatedUser;
  } catch (error) {
    return { error: "Server error! Request not completed" };
  }
}

router.get("/user", isAuth, async (req, res) => {
  const user = await getUser(req.body.id);
  if (!user.error) {
    res.status(200).json(user);
  } else {
    res.status(500).json({ message: user.error });
  }
});
router.get("/admin/user", isAdmin, async (req, res) => {
  const user = await getUser(req.body.id);
  if (!user.error) {
    res.status(200).json(user);
  } else {
    res.status(500).json({ message: user.error });
  }
});
router.get("/admin/users", isAdmin, async (req, res) => {
  const users = await getAllUsers();
  if (!users.error) {
    res.status(200).json(users);
  } else {
    res.status(500).json({ message: users.error });
  }
});
router.put("/user", isAuth, async (req, res) => {
  const updatedUser = await updateUser(req.body.id, req.body.data);
  if (!updatedUser.error) {
    res.status(200).json(updatedUser);
  } else {
    res.status(500).json({ message: updatedUser.error });
  }
});
router.put("/admin/user", isAdmin, async (req, res) => {
  const updatedUser = await updateUser(req.body.id, req.body.data);
  if (!updatedUser.error) {
    res.status(200).json(updatedUser);
  } else {
    res.status(500).json({ message: updatedUser.error });
  }
});
router.delete("/admin/user", isAdmin, async (req, res) => {
  const userid = Number(req.params.id);
  const deletedUser = await deleteUser(userid);
  if (!deletedUser.error) {
    res.status(200).json(deletedUser);
  } else {
    res.status(500).json({ message: deletedUser.error });
  }
});

module.exports = router;
