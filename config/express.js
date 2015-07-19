'use strict';

/*
 * Initializes and configures the express application
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var mongoStore = require('connect-mongo')({
  session: session
});

var config = require('./config');

// TODO: Configure this to be different for dev vs prod
module.exports = function(db) {
  var app = express();

  // Add logging
  app.use(logger('dev'));
  app.set('showStackError', true);

  // Get all data from request bodies
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(methodOverride());

  // Expose static files as residing in top-level domain
  // FIXME: In prod, a CDN should be used instead
  app.use(express.static(path.join(__dirname, '../public')));

  // Setup server-side template engine
  // TODO: Change this to use whatever templating engine we use
  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'ejs');

  // Configure the mongoDB session store
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: new mongoStore({
      db: db.connection.name,
      collection: config.sessionCollection
    })
  }));

  // TODO: Add in passport middleware for session management
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // FIXME: Figure out better place to configure routing
  require('../app/router')(app);

  // Add in some error handling
  // FIXME: Need to handle differently for prod vs dev
  app.use(function(req, resp, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function(err, req, resp, next) {
    resp.status(err.status || 500);
    console.log(err);
    resp.render('error', {
      message: err.message,
      error: err
    });
  });

  // Give back fully configured application
  return app;
};
