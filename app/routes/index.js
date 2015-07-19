'use strict';

/*
 * Defines routing for main application homepage
 * and user account pages
 */

var router      = require('express').Router();
var isLoggedIn  = require('../utils/middleware').isLoggedIn;

// GET - home page
router.get('/', function homePage(req, res) {
  res.render('home', { title: 'Serve' });
});

// GET - User main page
router.get('/main', isLoggedIn, function accountPage(req, res) {
  res.render('main', {
    user: req.user
  });
});

router.get('/login', function loginPage(req, res) {
  res.render('login');
});

router.get('/register', function registrationPage(req, res) {
  res.render('register');
});

router.get('/create', isLoggedIn, function createPage(req, res) {
  res.render('create', {
    user: req.user
  });
});

router.get('/design', isLoggedIn, function designPage(req, res) {
  res.render('design', {
    user: req.user
  });
});

module.exports = router;
