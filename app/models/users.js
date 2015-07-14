'use strict';

/*
 * defines the user model for storing user information
 */

var mongoose        = require('mongoose');
var crypto          = require('crypto');
var phone           = require('node-phonenumber');
var uniqueValidator = require('mongoose-unique-validator');

var servletSchema   = require('./servlets').schema;

var phoneUtil = phone.PhoneNumberUtil.getInstance();
var MIN_PASS_LEN = 6;
var SALT_LEN = 16;

/*
 * Helper function to check password validity
 */
var passwordValid = function(password) {
  return password && password.length > MIN_PASS_LEN;
};

var userSchema = mongoose.Schema({
  firstName: {
    type: String,
    default: '',
    required: 'First name must be provided'
  },
  lastName: {
    type: String,
    default: '',
    required: 'Last name must be provided'
  },
  email: {
    type: String,
    default: '',
    required: 'Email must be provided',
    unique: true,
    match: [/.+\@.+\..+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    default: '',
    required: 'Password must be provided',
    validate: [
      passwordValid,
      'Password must be ' + MIN_PASS_LEN + ' or more characters'
    ]
  },
  phoneNumber: {
    type: String,
    default: '',
    required: 'Phonenumber must be provided',
    unique: true,
    validate: [phoneUtil.isValidNumber, 'Phonenumber must be valid']
  },
  servlets: {
    type: [servletSchema]
  },
  salt: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// Use unique validator to get uniqueness errors as mongoose errors
userSchema.plugin(uniqueValidator, { message: 'Given {PATH} is already in use' });

/*
 * define pre save hook to generate password salt and
 * save hashed version of password
 */
userSchema.pre('save', function(next) {
  if (this.passwordValid(this.password)) {
    this.salt = new Buffer(crypto.randomBytes(SALT_LEN).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

userSchema.methods.passwordValid = passwordValid;

/*
 * hashs the saved password for the user object
 * TODO: Look into security of the hash function used here
 */
userSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/*
 * check whether the given password hash matches the
 * password hash expected for the user
 */
userSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

module.exports = mongoose.models('User', userSchema);
