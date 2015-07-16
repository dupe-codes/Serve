'use strict';

/*
 * Defines all routes associated with user management
 * and creating Servlets for specific users
 */

var router            = require('express').Router();
var userController    = require('../controllers/userController');
var servletController = require('../controllers/servletController');
var isLoggedIn        = require('../utils/middleware').isLoggedIn;

router.post('/signup', userController.createAccount);
router.post('/login', userController.accountLogin);

router.post('/servlet', isLoggedIn, servletController.createServlet);
router.delete('/servlet', isLoggedIn, servletController.removeServlet);

module.exports = router;
