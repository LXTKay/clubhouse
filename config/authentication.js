const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");


async function verify(username, password, done) {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    };
    if (!(await bcrypt.compare(password, user.hash))) {
      return done(null, false, { message: "Incorrect password" });
    };
    return done(null, user);
  } catch(err) {
    return done(err);
  };
};

passport.use(new LocalStrategy(verify));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});