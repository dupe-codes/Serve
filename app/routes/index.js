'use strict';

/*
 * Defines routing for main application homepage
 * and user account pages
 */

var router      = require('express').Router();
var isLoggedIn  = require('../utils/middleware').isLoggedIn;

// GET - home page
router.get('/', function homePage(req, res) {
  res.render('index', { pagetitle: 'Serve' });
});

// GET - User main page
router.get('/main', isLoggedIn, function accountPage(req, res) {
  res.render('main', {
    user: req.user
  });
});

module.exports = router;
