const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Idea} = require('./models/Ideas');

const app = express();

mongoose.promise = global.promise;

mongoose.connect('mongodb://localhost/vidjot')
.then(() => {
  console.log('Mongodb Connected');
}).catch((err) => console.log(err));

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const port = 3000;

app.get('/', (req, res) => {
  var title = 'Welcome';
  res.render('index', {
    title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
});

app.post('/ideas', (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({text: 'Please add a title'});
  }
  if (!req.body.details) {
    errors.push({text: 'Please add some details'});
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
      res.redirect('/ideas');
    });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
