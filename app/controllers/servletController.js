'use strict';

/*
 * Defines logic for creating, editing, and managing user Servlets
 */

var Servlet = require('../models/servlets').Servlet;

module.exports = {

  /*
   * Given data in a post request body, creates
   * a Servlet and adds it to the current user's
   * list of Servlets
   */
  createServlet: function(req, res) {
    var data = JSON.parse(req.body.data);
    data.language = 'python'; // FIXME: Need to include this in create form
    req.user.addServlet(data);
    req.user.save(function saveUser(err){
      if (err) {
        throw err; // FIXME: Handle error in a better way
      }
    });

    res.redirect('/main');
  },

  /*
   * Removes the desired Servlet from the currently
   * authenticated user's list of Servlets
   */
  removeServlet: function(req, res) {
    // TODO: Implement this
    res.redirect('/main');
  }

};
