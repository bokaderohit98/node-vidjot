const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const User = require('../models/User');

module.exports = (passport) => {
  passport.use(new localStrategy({
      usernameField: 'email'
    },
    (email, password, done) => {
      User.findOne({
        email
      }).then((user) => {
        if (user) {
          bcrypt.compare(password, user.password).then((result) => {
            if (!result) {
              return done(null, false, {
                message: 'Email and Password does not match.'
              });
            } else {
              return done(null, user);
            }
          });
        } else {
          return done(null, false, {
            message: 'User not found'
          })
        }
      });
    }))

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
