'use strict';

/*
 * Global application configuration
 * TODO: Look into using a database other than mongoDB
 */

module.exports = {
  db: process.env.DATABASE_URL || 'mongodb://localhost/serve-dev',
  port: process.env.PORT || 8080,
  host: process.env.HOST_IP || '127.0.0.1',
  sessionSecret: process.env.SESSION_SECRET || 'expandingSMSfunctionality',
  sessionCollection: process.env.SESSION_STORE || 'sessions',

  // Twilio account/API credentials
  twilio: {
    accountId: process.env.TWILIO_ID || 'none',
    authToken: process.env.TWILIO_AUTH || 'none',
    phoneNumber: process.env.TWILIO_NUMBER || '1800DEVELOPR'
  }
};
