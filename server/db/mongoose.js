var mongoose = require('mongoose');

var url = process.env.MONGODB_URI;
mongoose.promise = global.promise;
mongoose.connect(url);

module.exports = {
	mongoose
}
