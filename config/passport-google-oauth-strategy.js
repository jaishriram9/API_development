const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const crypto = require("crypto");
const User = require("../models/user");
const dotenv = require("dotenv").config();

//tell passport to use a new Strategy to google login
passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID_GOOGLE,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE,
      callbackURL: process.env.CALLBACK_URL_GOOGLE,
      passRequestToCallback: true,
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }).exec(function (
        err,
        user
      ) {
        if (err) {
          console.log("error in finding user in google strategy passport", err);
          return;
        }
        console.log("proffffileeee", profile);
        console.log("AAAAAAAAAAAAAAAA", accessToken);
        if (user) {
          // If user is found , set this user as req.user
          return done(null, user);
        } else {
          //If not found, create new user
          User.create(
            {
              name: profile.name.givenName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(12).toString("hex"),
              token: accessToken,
            },
            function (error, user) {
              if (error) {
                console.log("error in creating user google strategy", error);
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
