const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor } = require("../middleware");
const Post = require("../models/posts");
const catchAsync = require("../utils/catchAsync");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render("home", { posts });
  })
);
router.get("/new", isLoggedIn, (req, res) => {
  res.render("posts/new");
});

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const post = new Post(req.body);
    post.author = req.user;
    await post.save();
    req.flash("success", "Made a new Post");
    res.redirect("/");
  })
);

router.get(
  "/show/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate("author");
    res.render("posts/view", { post });
  })
);
router.get(
  "/show/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    res.render("posts/edit", { post });
  })
);
router.put(
  "/show/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, req.body);
    req.flash("success", "Post edited!");
    res.redirect(`/show/${id}`);
  })
);
router.delete(
  "/show/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    req.flash("success", "Post deleted!");
    res.redirect("/");
  })
);

module.exports = router;
