'use strict';

/*
 * Defines mongoose model for storing information about
 * an uploaded SMS app ("Servlet")
 */

var mongoose = require('mongoose');

var servletSchema = mongoose.Schema({
  name: {
    type: String,
    default: '',
    required: 'Servlet must be given a name'
  },
  description: {
    type: String,
    default: ''
  },
  recipient: {
    type: String,
    default: []
  },
  code: {
    type: String,
    default: '',
    required: 'Servlet code must be provided'
  }
});

var Servlet = mongoose.model('Servlet', servletSchema);

module.exports = {
  Schema: servletSchema,
  Servlet: Servlet
};
