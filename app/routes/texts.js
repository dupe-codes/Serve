'use strict';

/*
 * Defines routes for all app SMS components
 */

var router            = require('express').Router();
var textsController   = require('../controllers/textsController');

router.post('/', textsController.incomingText);

module.exports = router;
