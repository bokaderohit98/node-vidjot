const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const {
  Idea
} = require('./models/Ideas');

//Initializing App
const app = express();

// Setting up mongoose
mongoose.promise = global.promise;
mongoose.connect('mongodb://localhost/vidjot')
  .then(() => {
    console.log('Mongodb Connected');
  }).catch((err) => console.log(err));

//Setting app engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Setting app middlewares
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Route for homepage
app.get('/', (req, res) => {
  var title = 'Welcome';
  res.render('index', {
    title
  });
});

//About route
app.get('/about', (req, res) => {
  res.render('about');
});

//Route to show ideas to a user
app.get('/ideas', (req, res) => {
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

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
  Idea.findById(req.params.id)
    .then((idea) => {
      res.render('ideas/edit', {
        idea
      });
    });
});

app.post('/ideas', (req, res) => {
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
        res.redirect('/ideas');
      })
      .catch((err) => {
        req.flash('error_msg', 'Video idea cannot be added');
        res.redirect('/ideas');
      });
  }
});

app.put('/ideas/:id', (req, res) => {
  Idea.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      details: req.body.details
    }, {
      new: true
    })
    .then((idea) => {
      req.flash('success_msg', 'Video idea updated')
      res.redirect('/ideas');
    })
    .catch((err) => {
      req.flash('error_msg', 'Video idea cannot be updated');
      res.redirect('/ideas');
    });
});

app.delete('/ideas/:id', (req, res) => {
  Idea.findByIdAndRemove(req.params.id)
    .then((idea) => {
      req.flash('success_msg', 'Video idea removed')
      res.redirect('/ideas');
    })
    .catch((err) => {
      req.flash('error_msg', 'Video idea cannot be removed');
      res.redirect('/ideas');
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
