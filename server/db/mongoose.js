var mongoose = require('mongoose');

var url = process.env.MONGODB_URI;

mongoose.promise = global.promise;
mongoose.connect(url).then(() => {
  console.log('connected to database');
}).catch((err) => {
  console.log(err);
  return;
});

module.exports = {
  mongoose
}
