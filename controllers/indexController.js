require('dotenv').config();
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const Message = require("../models/msg");

exports.get = asyncHandler(async (req, res) => {

  let messages = await Message.find({}).sort({ timestamp: -1 }).limit(10);
  messages = messages.slice(0,10);
  res.render("index", { 
    title: "Home",
    user: req.user,
    messages: messages});
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

exports.postMsg = [
  body("msgBody")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Message must be between 1 and 200 characters long.")
    .escape(),

  body("msgTitle")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters long.")
    .escape(),

  asyncHandler(async (req, res) => {
    const error = validationResult(req);
    
    if (!error.isEmpty()) {
      res.render("index", {
        title: "Home",
        user: req.user,
        errors: error.array(),
      });
      return;
    }
    console.log("no error")

    const msg = new Message({
      title: req.body.msgTitle,
      content: req.body.msgBody,
      author: req.user.username
    });

    await msg.save();
    res.redirect("/");
  })
];

exports.activateCode = [
  body("code")
    .trim()
    .escape(),

  asyncHandler(async (req, res) => {
    const error = validationResult(req);
    const memberCode = process.env.MEMBERCODE;
    const adminCode = process.env.ADMINCODE;

    const user = await User.findById(req.user._id);

    if (req.body.code === memberCode) {
      user.memberstatus = true;
    } else if (req.body.code === adminCode) {
      user.isAdmin = true;
    } else {
      error.array().push({ msg: "Invalid code." });
    }

    if (!error.isEmpty()) {
      res.render("index", {
        title: "Home",
        user: req.user,
        errors: error.array(),
      });
      return;
    }

    await user.save();

    res.redirect("/");
  })
];

exports.deleteMsg = asyncHandler(async (req, res) => {
  console.log("deleting")
  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/");
})