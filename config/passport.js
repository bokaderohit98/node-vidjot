const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const User = require('../server/models/User');

module.exports = (passport) => {
  passport.use(new localStrategy({
      usernameField: 'email'
    },
    (email, password, done) => {
      User.findOne({
        email
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'User not found'
          });
        } else {
          bcrypt.compare(password, user.password).then((result) => {
            if (!result) {
              return done(null, false, {
                message: 'Email and Password does not match.'
              });
            } else {
              return done(null, user);
            }
          });
        }
      });
    }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
