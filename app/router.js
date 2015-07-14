'use strict';

/*
 * Configures overall application routing.
 */

module.exports = function(app) {
  // Index/site routes
  app.use('/', require('./routes/index'));

  // User routes
  app.use('/users/', require('./routes/users'));

};
