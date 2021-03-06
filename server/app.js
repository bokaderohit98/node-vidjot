const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');

//Environment Config
require('./config/config');

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//Initializing App
const app = express();

//Adding static folder
app.use(express.static(path.join(__dirname, '../public')));

// Setting up mongoose
const mongoose = require('./db/mongoose');

//Setting port
const port = process.env.PORT;

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
app.use(passport.initialize());
app.use(passport.session());

//Global variables Middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Redirecting to Routes
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

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
