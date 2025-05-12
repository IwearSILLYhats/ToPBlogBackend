const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { authLocal, authJwt } = require("../auth/auth");
const jwt = require("jsonwebtoken");

// request all users
router.get("/", (req, res) => {
  return res.json({ message: "request all users" });
});
// request a specific user
router.get("/:userid", (req, res) => {
  return res.json({ message: "request a user" });
});

router.get("/:userid/posts", async (req, res) => {
  try {
    const userPosts = await prisma.post.findMany({
      where: {
        author_id: parseInt(req.params.userid),
      },
    });
    console.log(userPosts);
    return res.json(userPosts);
  } catch (error) {
    console.log(error);
    return res.json({
      message: `Requested all posts for ${req.params.userid} ERROR`,
    });
  }
});
// login a user
router.post("/login", authLocal, async (req, res) => {
  if (req.user) {
    const { id, username } = req.user;
    const opts = {
      expiresIn: "1h",
    };
    const token = jwt.sign({ id }, process.env.SECRET, opts);
    return res.status(200).json({
      success: "Successfully logged in",
      token,
      username: username,
      id: id,
    });
  }

  return res.json({ error: "Incorrect email or password", success: null });
});

// create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = {
      username: req.body.username,
      email: req.body.email,
    };
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: newUser.username,
          },
          {
            email: newUser.email,
          },
        ],
      },
    });
    if (user && user.username === newUser.username) {
      return res.json({ error: "Username already exists" });
    }
    if (user && user.email === newUser.email) {
      return res.json({ error: "Email address already has an account" });
    }
    if (req.body.password !== req.body.confirm) {
      return res.json({ error: "Passwords do not match" });
    }
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      newUser.password = hashedPassword;

      await prisma.user.create({
        data: newUser,
      });
    });
    return res.json({
      error: null,
      success: `Username ${newUser.username} successfully created, redirecting to login page`,
    });
  } catch (error) {
    throw error;
  }
});
// update a user
router.put("/:userid", (req, res) => {
  return res.json({ message: "update a user" });
});
// delete a user
router.delete("/:userid", (req, res) => {
  return res.json({ message: "delete a users" });
});

module.exports = router;
