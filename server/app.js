const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');


//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Initializing App
const app = express();

//Adding static folder
app.use(express.static(path.join(__dirname, '../public')));

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

//Use Route
app.use('/ideas', ideas);
app.use('/users', users);

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


const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
