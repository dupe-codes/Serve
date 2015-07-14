'use strict';

/*
 * Configuration for passport authentication system
 */

var passport = require('passport');
var User = require('../app/models/users').User;
var path = require('path');

module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, '-salt -password', function(err, user) {
      done(err, user);
    });
  });

  // Set strategies to be used by the passport system
  // FIXME: Figure out how to import this better
  require('./strategies/local')(passport);
};
