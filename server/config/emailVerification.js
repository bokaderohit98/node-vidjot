//Loading dependencies
const User = require('../models/User');
const mongoose = require('mongoose');
const nev = require('email-verification')(mongoose);
const transporter = require('./nodemailer');
const bcrypt = require('bcryptjs');

var hasher = (password, tempUserData, insertTempUser, callback) => {
  bcrypt.genSalt(8, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      return insertTempUser(hash, tempUserData, callback);
    });
  });
}

//configuration
nev.configure({
  verificationURL: process.env.HOST+'/users/email-verification/${URL}',
  persistentUserModel: User,
  tempUserCollection: 'tempUser',

  transportOptions: transporter.transporter.options,
  verifyMailOptions: {
    from: `Do Not Reply <${process.env.EMAIL}>`,
    subject: 'Please confirm account',
    html: '<p>Click the following link to confirm your account:</p><p>${URL}</p>',
    text: 'Please confirm your account by clicking the following link: ${URL}'
  },

  hashingFunction: hasher,

}, (err, options) => {
  if (err) {
        console.log(err);
        return;
    }
});


//Genetating a temporary user model
nev.generateTempUserModel(User, (err, options) => {
  if (err) {
        console.log(err);
        return;
  }
  console.log('created temp user model');
});

module.exports = nev;
