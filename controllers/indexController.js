const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.get = asyncHandler(async (req, res) => {
  res.render("index", { 
    title: "Home",
    user: req.user});
});

exports.logIn = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  });

exports.logOut = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});