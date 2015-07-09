'use strict';

/*
 * Configures overall application routing.
 */

module.exports = function(app) {
  // Index routes
  app.use('/', require('./routes/index'));
};
