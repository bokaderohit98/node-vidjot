const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nev = require('../config/emailVerification');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
  var errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'Password do not match'
    });
  }

  if (req.body.password.length < 5) {
    errors.push({
      text: 'Password must have atleast 5 characters'
    });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    //initialize newUser
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    nev.createTempUser(newUser, (err, existingPersistentUser, newTempUser) => {

      if (err) {
        console.log(err);
      } else if (existingPersistentUser) {
        req.flash('error_msg', 'User already exist. Login to continue');
        res.redirect('/users/login');
      } else if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmail(newUser.email, URL, (err, info) => {
          if (err) {
            console.log(err);
          } else {
            req.flash('success_msg', 'Successfully Registered. To login, first confirm your email address within 24 hours');
            res.redirect('/users/login');
          }
        });
      } else {
        req.flash('success_msg', 'User is already registered. Please verify account');
        res.redirect('/users/login');
      }
    });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been logged out');
  res.redirect('/users/login');
});

router.get('/email-verification/:URL', (req, res) => {
  var url = req.params.URL;

  nev.confirmTempUser(url, (err, user) => {
    if (user) {
      nev.sendConfirmationEmail(user.email, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          req.flash('success_msg', 'Email verified successfully. Now you can log in');
          res.redirect('/users/login');
        }
      });
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
