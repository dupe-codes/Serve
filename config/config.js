'use strict';

/*
 * Global application configuration
 */

module.exports = {
  db: process.env.DATABASE_URL || 'mongodb://localhost/serve-dev',
  port: process.env.PORT || 8080,
  sessionSecret: process.env.SESSION_SECRET || 'expandingSMSfunctionality',
  sessionCollection: 'sessions'
}
