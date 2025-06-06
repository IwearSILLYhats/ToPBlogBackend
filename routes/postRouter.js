const express = require("express");
const router = express.Router();
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const commentRouter = require("./commentRouter");
const { authJwt, checkVerified } = require("../auth/auth");

// pass to comment router for comments under postId
router.use("/:postid/comments", commentRouter);

// request specific post
router.get("/:postid", async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.postid),
      },
    });
    if (!post) throw new Error({ message: "Requested post not found" });
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.json(error.message);
  }
});
// find all posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        author: {
          select: {
            username: true,
          },
        },
      },
      where: {
        published: true,
      },
    });
    if (!posts) throw new Error({ error: "No published posts found." });
    return res.json({ posts });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
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
      success: "Post successfully created",
      id: newPost.id,
    });
  } catch (error) {
    return res.json({ error });
  }
});
// update existing post
router.put("/:postid", authJwt, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.postid),
      },
    });
    if (req.user.id !== post.author_id) {
      throw new Error({ error: "User not authorized to modify this post" });
    }
    if (req.body.published) req.body.time_published = new Date();
    await prisma.post.update({
      where: {
        id: parseInt(req.params.postid),
      },
      data: req.body,
    });
    return res.json({ error: null, success: "Post updated successfully!" });
  } catch (error) {
    console.log(error);
    return res.json({ error: error });
  }
});
// delete existing post
router.delete("/:postid", authJwt, checkVerified, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: parseInt(req.params.postid),
      },
    });
    if (post.author_id !== req.user.id) {
      throw new Error({ error: "User not authorized to delete this post." });
    }
    await prisma.post.delete({
      where: {
        id: parseInt(post.id),
      },
    });
    return res.json({
      error: null,
      success: "Post successfully deleted.",
    });
  } catch (error) {
    return res.json({ error: error });
  }
});

module.exports = router;
