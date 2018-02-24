const express = require('express');
const router = express.Router();

//Loading Idea Model
const Idea = require('../models/Idea');

router.get('/', (req, res) => {
  Idea.find({})
    .sort({
      date: 'descending'
    })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas,
      });
    });
});

router.get('/add', (req, res) => {
  res.render('ideas/add');
});

router.get('/edit/:id', (req, res) => {
  Idea.findById(req.params.id)
    .then((idea) => {
      res.render('ideas/edit', {
        idea
      });
    });
});

router.post('/', (req, res) => {
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
    };
    new Idea(newUser)
      .save()
      .then((idea) => {
        req.flash('success_msg', 'Video idea added');
        res.redirect('/');
      })
      .catch((err) => {
        req.flash('error_msg', 'Video idea cannot be added');
        res.redirect('/');
      });
  }
});

router.put('/:id', (req, res) => {
  Idea.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      details: req.body.details
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

router.delete('/:id', (req, res) => {
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
