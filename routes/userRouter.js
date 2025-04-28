const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// request all users
router.get("/", (req, res) => {
  return res.json({ message: "request all users" });
});
// request a specific user
router.get("/:userid", (req, res) => {
  return res.json({ message: "request a user" });
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
