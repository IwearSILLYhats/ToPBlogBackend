const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// request all comments on post
router.get("/", (req, res) => {
  return res.json({ message: "Get all comments" });
});
// request specific comment on post
router.get("/:commentid", (req, res) => {
  return res.json({ message: "Get a comment" });
});
// create new comment
router.post("/", (req, res) => {
  return res.json({ message: "Create a new comment" });
});
// edit existing comment
router.put("/:commentid", (req, res) => {
  return res.json({ message: "Update a comment" });
});
// delete existing comment
router.delete("/:commentid", (req, res) => {
  return res.json({ message: "Delete a comment" });
});

module.exports = router;
