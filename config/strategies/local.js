'use strict';

/*
 * Defines strategy for user authentication through local
 * site sign-on
 */

var LocalStrategy = require('passport-local').Strategy;
// FIXME: This relative import sucks - figure out better way to export models
var User = require('../../app/models/users').User;

module.exports = function(passport) {

  // Set strategy for users logging in with Serve credentials
  // FIXME: Change from using phonenumbers to email addr as unique identifier
  passport.use('local-login', new LocalStrategy({
    usernameField: 'phoneNumber', // use phonenumber as user identifier
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, phoneNumber, password, done) {
    console.log(phoneNumber);
    process.nextTick(function() {
      User.findOne({ phoneNumber: phoneNumber }, function(err, user) {
        // Some error occurred
        console.log(phoneNumber);
        if (err) { return done(err); }

        // User with given username doesn't exist
        if (!user) { return done(null, false, req.flash('loginError', 'Unkown user')); }

        // User exists, now check if password is valid
        if(!user.authenticate(password)) {
          return done(null, false, req.flash('loginError', 'Oops! Wrong password'));
        }

        return done(null, user);
      });
    });
  }));

  // Set strategy for users creating Serve credentials
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'phoneNumber',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, phoneNumber, password, done) {
    process.nextTick(function() {
      User.findOne({ phoneNumber: phoneNumber }, function(err, user) {
        if (err) { console.log(err); return done(err); }

        // Check if user already exists with given phoneNumber
        if (user) {
          console.log('User already exists');
          return done(null, false, req.flash('signupMessage', 'That phone number is already taken'));
        } else {

          // TODO: Check that this method for creating the new user works here
          var newUser = new User(req.body);
          newUser.save(function(err) {
            if (err) {
              var message = '';
              for (var key in err.errors) { message = err.errors[key].message; } // TODO: Handle this better
              console.log(message);
              return done(null, false, req.flash('signupMessage', message));
            } else {
              return done(null, newUser);
            }
          });
        }
      });
    });
  }));

};
