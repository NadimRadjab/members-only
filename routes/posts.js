const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor } = require("../middleware");
const Post = require("../models/posts");

router.get("/", async (req, res) => {
  const posts = await Post.find({}).populate("author");
  res.render("home", { posts });
});
router.get("/new", isLoggedIn, (req, res) => {
  res.render("posts/new");
});

router.post("/", async (req, res) => {
  const post = new Post(req.body);
  post.author = req.user;
  await post.save();
  res.redirect("/");
});

router.get("/show/:id", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("author");
  res.render("posts/view", { post });
});
router.get("/show/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render("posts/edit", { post });
});
router.put("/show/:id", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, req.body);
  res.redirect(`/show/${id}`);
});
router.delete("/show/:id", isLoggedIn, isAuthor, async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect("/");
});

module.exports = router;
