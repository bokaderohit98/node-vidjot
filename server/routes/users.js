const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', (req, res) => {
  var errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({text: 'Password do not match'});
  }

  if (req.body.password.length < 5) {
    errors.push({text: 'Password must have atleast 5 characters'});
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email
    });
  } else {
    res.send('passed');
  }
});

router.post('/login', (req, res) => {
  res.send('logged in');
});

module.exports = router;
