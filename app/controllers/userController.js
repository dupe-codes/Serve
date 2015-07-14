'use strict';

/*
 * Implements logic for handling Serve users
 */

var User = require('../models/users').User;
var passport = require('passport');

module.exports = {

  // wrapper around passport signup strategy
  createAccount: passport.authenticate('local-signup', {
    successRedirect: '/main',
    failureRedirect: '/users/signup',
    failureFlash: true
  }),

  // wrapper around passport login strategy
  accountLogin: passport.authenticate('local-login', {
    successRedirect: '/main',
    failureRedirect: '/login',
    failureFlash: true
  }),

  // Function to get a list of all users in the DB
  listUsers: function(req, resp) {
    User.find(function(err, users) {
      if (err) {
        resp.send({'success': false, 'error': err});
      } else {
        resp.send({'success': true, 'users': users});
      }
    });
  }
};
