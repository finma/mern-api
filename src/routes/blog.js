const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  createBlogPost,
  getAllBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
} = require("../controllers/blog");

// [POST] : /v1/blog/post
router.post(
  "/post",
  [
    body("title").isLength({ min: 5 }).withMessage("Title minimal 5 karakter!"),
    body("body").isLength({ min: 5 }).withMessage("Body minimal 5 karakter!"),
  ],
  createBlogPost
);

router.get("/posts", getAllBlogPost);
router.get("/post/:postId", getBlogPostById);
router.put(
  "/post/:postId",
  [
    body("title").isLength({ min: 5 }).withMessage("Title minimal 5 karakter!"),
    body("body").isLength({ min: 5 }).withMessage("Body minimal 5 karakter!"),
  ],
  updateBlogPost
);

router.delete("/post/:postId", deleteBlogPost);

module.exports = router;
