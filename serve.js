'use strict';

// Initialize and run the Serve platform

var config = require('./config/config');
var mongoose = require('mongoose');

var db = mongoose.connect(config.db);
var app = require('./config/express')(db);

app.listen(config.port);
console.log('Serve Platform running on port ' + config.port);

exports = module.exports = app;
