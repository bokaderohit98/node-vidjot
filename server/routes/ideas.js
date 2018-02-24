const express = require('express');
const router = express.Router();

//Authorization middleware
const {
  ensureAuthenticated
} = require('../helpers/auth');

//Loading Idea Model
const Idea = require('../models/Idea');

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({
      user: req.user.id
    })
    .sort({
      date: 'descending'
    })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findById(req.params.id)
    .then((idea) => {
      if (idea.user != req.user.id) {
        req.flash('error_msg', 'Unauthorized Access');
        res.redirect('/ideas');
      } else {
        res.render('ideas/edit', {
          idea
        });
      }
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Idea(newUser)
      .save()
      .then((idea) => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/ideas');
      })
      .catch((err) => {
        req.flash('error_msg', 'Video idea cannot be added');
        res.redirect('/ideas');
      });
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }, {
      new: true
    })
    .then((idea) => {
      req.flash('success_msg', 'Video idea updated')
      res.redirect('/');
    })
    .catch((err) => {
      req.flash('error_msg', 'Video idea cannot be updated');
      res.redirect('/');
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndRemove(req.params.id)
    .then((idea) => {
      req.flash('success_msg', 'Video idea removed')
      res.redirect('/');
    })
    .catch((err) => {
      req.flash('error_msg', 'Video idea cannot be removed');
      res.redirect('/');
    });
});


module.exports = router;
