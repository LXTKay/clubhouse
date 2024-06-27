const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.get = asyncHandler(async (req, res) => {
  res.render("signUp", {
    title: "Sign Up",});
});

exports.post = [
  body("username")
    .trim()
    .isLength({min: 3})
    .withMessage("Username must have at least 3 characters")
    .isLength({max: 20})
    .withMessage("Username can have max. 20 characters")
    .escape()
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers"),
    
  body("firstname")
    .trim()
    .isLength({min: 3})
    .withMessage("First Name must have at least 3 characters")
    .isLength({max: 20})
    .withMessage("First Name can have max. 20 characters")
    .escape(),
    
  body("lastname")
  .trim()
  .isLength({min: 3})
  .withMessage("Last Name must have at least 3 characters")
  .isLength({max: 20})
  .withMessage("Last Name can have max. 20 characters")
  .escape(),

  body("password")
    .trim()
    .isLength({min: 3})
    .withMessage("Password must have at least 3 characters")
    .isLength({max: 20})
    .withMessage("Password can have max. 100 characters"),
  
  asyncHandler(async (req, res) => {

    const errors = validationResult(req);

    const user = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      memberstatus: false,
      isAdmin: false,
      hash: null
    });

    if (!errors.isEmpty()) {
      res.render("signUp", {
        title: "Sign Up",
        user: user,
        errors: errors.array(),
      });
    };

    await bcrypt.hash(req.body.password, 10, async (err, generatedHash) => {
      user.hash = generatedHash;
      await user.save();
      res.redirect("/");   
    });
})];