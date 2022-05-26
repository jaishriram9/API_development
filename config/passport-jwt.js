const passport = require("passport");
const passportJWT = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
var opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret",
};

passport.use(
  new passportJWT(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload._id }, function (err, user) {
      if (err) {
        console.log("error in finding user from JWT");
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

module.exports = passport;