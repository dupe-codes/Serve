'use strict';

/*
 * Initialize and run the Serve platform
 */

var config = require('./config/config');
var mongoose = require('mongoose');

var db = mongoose.connect(config.db);
var app = require('./config/express')(db);

// Bootstrap passport configuration
require('./config/passport')();

app.listen(config.port, config.host);
console.log(
  'Serve Platform running at ' + config.host + ':' + config.port
);

exports = module.exports = app;
