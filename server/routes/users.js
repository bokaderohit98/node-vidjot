const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

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

    //Check if the email already exist
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user) {
        //Throw error message if user already exists
        req.flash('error_msg', 'Email already exists');
        res.redirect('/users/register');
      } else {
        //Create user if email doesnt already exist
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then((user) => {
                req.flash('success_msg', 'Successfully registered. Login to continue');
                res.redirect('/users/login');
              })
          });
        });
      }
    }).catch((err) => {
      console.log(err);
      return;
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

module.exports = router;
