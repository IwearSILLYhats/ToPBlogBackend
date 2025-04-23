const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const commentRouter = require("./commentRouter");

// find all posts
router.get("/", (req, res) => {
  return res.json({ message: "Get all posts" });
});
// request specific post
router.get("/:postid", (req, res) => {
  return res.json({ message: "Get a specific post" });
});
// create new post
router.post("/", (req, res) => {
  return res.json({ message: "Create a new post" });
});
// update existing post
router.put("/:postid", (req, res) => {
  return res.json({ message: "Update a post" });
});
// delete existing post
router.delete("/:postid", (req, res) => {
  return res.json({ message: "Delete a post" });
});
// pass to comment router for comments under postId
router.all("/:postid/comments", commentRouter);

module.exports = router;
