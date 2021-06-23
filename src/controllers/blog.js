const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const BlogPost = require("../models/blog");

const createBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  const file = req.files.image;
  const fileName = `${new Date().getTime()}-${file.name}`;

  if (!errors.isEmpty()) {
    const err = new Error("Invalid value!");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!file) {
    const err = new Error("Image must be uploaded!");
    err.errorStatus = 422;
    throw err;
  }

  file.mv(`./images/${fileName}`, (err, result) => {
    if (err) {
      res.status(400).send(err);
    }
  });

  const { title, body } = req.body;
  const image = `images/${fileName}`;

  const Posting = new BlogPost({
    title,
    image,
    body,
    author: {
      uid: 1,
      name: "Firman Maulana",
    },
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create Blog Success!",
        data: result,
      });
    })
    .catch((err) => console.log(err));
};

const getAllBlogPost = (req, res, next) => {
  BlogPost.find()
    .then((result) => {
      res
        .status(200)
        .json({ message: "Get all blog post success!", data: result });
    })
    .catch((err) => next(err));
};

const getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!postId) {
        const err = new Error("Blog post not found!");
        err.errorStatus = 404;
        throw err;
      }

      res.status(200).json({
        message: "Blog post found!",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const updateBlogPost = (req, res, next) => {
  const errors = validationResult(req);
  const file = req.files.image;
  const fileName = `${new Date().getTime()}-${file.name}`;

  if (!errors.isEmpty()) {
    const err = new Error("Invalid value!");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!file) {
    const err = new Error("Image must be uploaded!");
    err.errorStatus = 422;
    throw err;
  }

  file.mv(`./images/${fileName}`, (err, result) => {
    if (err) {
      res.status(400).send(err);
    }
  });

  const { title, body } = req.body;
  const image = `images/${fileName}`;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog post not found!");
        err.errorStatus = 404;
        throw err;
      }

      post.title = title;
      post.image = image;
      post.body = body;

      return post.save();
    })
    .then((result) => {
      res.status(400).json({
        message: "Update blog post success!",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((post) => {
      if (!postId) {
        const err = new Error("Blog post not found!");
        err.errorStatus = 404;
        throw err;
      }

      removeImage(post.image);
      return BlogPost.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Delete Blog Post success!",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const removeImage = (filepath) => {
  filepath = path.join(__dirname, "../..", filepath);
  fs.unlink(filepath, (err) => console.log(err));
};

module.exports = {
  createBlogPost,
  getAllBlogPost,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
