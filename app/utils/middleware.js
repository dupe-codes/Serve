'use strict';

/*
 * Defines useful middleware functions for use throughout
 * the application
 */

module.exports = {

  /*
   * Checks whether the given request has a valid user session
   * and redirects to the login page if not
   */
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/users/login');
    }
  }

};
