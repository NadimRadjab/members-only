const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registerdUser = await User.register(user, password);
      req.login(registerdUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Successfully registerd");
        res.redirect("/");
      });
    } catch (e) {
      res.redirect("/users/register");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successFlash: ("success", "Successfully sigend in!"),
    successRedirect: "/",
    failureFlash: true,
    failureRedirect: "/users/login",
  })
);
router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Successfully signed out!");
  res.redirect("/");
});

module.exports = router;
