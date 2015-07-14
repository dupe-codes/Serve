'use strict';

/*
 * Defines all routes associated with user management
 */

var router          = require('express').Router();
var userController  = require('../controllers/userController');

router.post('/signup', userController.createAccount);

router.post('/login', userController.accountLogin);

module.exports = router;
