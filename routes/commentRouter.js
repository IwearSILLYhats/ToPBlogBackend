const express = require("express");
const router = express.Router({ mergeParams: true });
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const { authJwt, checkVerified } = require("../auth/auth");

// request all comments on post or user profile
router.get("/", async (req, res) => {
  try {
    let comments;
    if (req.params.postid) {
      comments = await prisma.comment.findMany({
        select: {
          id: true,
          author: {
            select: {
              username: true,
              id: true,
            },
          },
          content: true,
          comment_id: true,
          post_id: true,
          timestamp: true,
        },
        where: {
          post_id: parseInt(req.params.postid),
        },
      });
    }
    if (req.params.userid) {
      comments = await prisma.comment.findMany({
        where: {
          authorid: parseInt(req.params.userid),
        },
      });
    }
    if (!comments || comments.length < 1) {
      throw new Error("No comments found");
    }
    return res.json({ success: comments, error: null });
  } catch (error) {
    return res.json({ error: error.message, success: null });
  }
});
// request specific comment on post
router.get("/:commentid", (req, res) => {
  return res.json({ message: "Get a comment" });
});
// create new comment
router.post("/", authJwt, async (req, res) => {
  try {
    const newComment = {
      author_id: req.user.id,
      content: req.body.content,
      post_id: parseInt(req.params.postid),
    };
    if (req.body.parent) {
      newComment.comment_id = parseInt(req.body.parent);
    }
    await prisma.comment.create({
      data: newComment,
    });
    return res.json({ success: newComment, error: null });
  } catch (error) {
    return res.json({ error: error, success: null });
  }
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
