const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");


async function verify(username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    console.log(`Inside authenticate function: \n
    username: ` + username + `\n
    password: ` + password + `\n
    user: ` + user);

    if (!user) {
      console.log("Wrong username")
      return done(null, false, { message: "Incorrect username" });
    };
    if (!(await bcrypt.compare(password, user.hash))) {
      console.log("Wrong password")
      return done(null, false, { message: "Incorrect password" });
    };
    console.log("Everything correct")
    return done(null, user);
  } catch(err) {
    return done(err);
  };
};

passport.use(new LocalStrategy(verify));
//Verify runs on passport.authenticate("local", {successRedirect: "/", failureRedirect: "/", })
//And the creates session cookie

passport.serializeUser((user, done) => {
  done(null, user.id);
});
//sets user.id in cookie

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});
//gets id from cookie and finds user in db