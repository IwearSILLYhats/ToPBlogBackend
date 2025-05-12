const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const commentRouter = require("./commentRouter");
const { authJwt, checkVerified } = require("../auth/auth");

// find all posts
router.get("/", (req, res) => {
  return res.json({ message: "Get all posts" });
});
// request specific post
router.get("/:postid", (req, res) => {
  return res.json({ message: "Get a specific post" });
});
// create new post
router.post("/", authJwt, async (req, res) => {
  try {
    const newPost = await prisma.post.create({
      data: {
        author_id: req.user.id,
      },
    });
    if (!newPost) {
      throw new Error("Error creating new post");
    }
    return res.status(200).json({
      message: "Post successfully created",
      id: newPost.id,
    });
  } catch (error) {
    return res.json({ error });
  }
});
// update existing post
router.put("/:postid", checkVerified, (req, res) => {
  return res.json({ message: "Update a post" });
});
// delete existing post
router.delete("/:postid", checkVerified, (req, res) => {
  return res.json({ message: "Delete a post" });
});
// pass to comment router for comments under postId
router.all("/:postid/comments", commentRouter);

module.exports = router;
