'use strict';

/*
 * Configures overall application routing.
 */

module.exports = function(app) {

  // Index/site routes
  app.use('/', require('./routes/index'));

  // User and user servlet routes
  app.use('/users/', require('./routes/users'));

};
