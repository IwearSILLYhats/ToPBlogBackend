const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

// request all users
router.get("/", (req, res) => {
  return res.json({ message: "request all users" });
});
// request a specific user
router.get("/:userid", (req, res) => {
  return res.json({ message: "request a user" });
});
// create a new user
router.post("/", (req, res) => {
  return res.json({ message: "create a user" });
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
