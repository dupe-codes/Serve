'use strict';

/*
 * Defines the main functionality for interacting with users
 * and running Servlets via SMS
 */

var twilio  = require('twilio');
var fs      = require('fs');
var spawn   = require('child_process').spawn;

var User            = require('../models/users').User;
var twilioSettings  = require('../../config/config').twilio;

var textingClient = new twilio.RestClient(
  twilioSettings.accountId,
  twilioSettings.authToken
);

module.exports = {

  /*
   * Overall endpoint called by twilio upon receving
   * a text message to the Serve number
   *
   * The incoming request should be a POST request, with
   * all needed data in the POST body
   */
  incomingText: function(req, res) {
    // TODO: Add check to ensure request is actually from a text

    var textResp = new twilio.TwimlResponse();
    var sendingNumber = req.body.From;
    User.findOne({'phoneNumber': sendingNumber}, function foundTextSender(err, user) {
      if (err) {
        textResp.message('An error occurred. Please try again.');
        res.send(textResp.toString());
      } else {
        if (!user) {
          // No user for the incoming number exists
          // TODO: Handle new user onboarding here
          console.log('Unknown user detected.'); // FIXME: Better logging
          textResp.message('Unknown number: ' + sendingNumber);
          res.send(textResp.toString());
          return;
        }

        var parsedText = parseTextMessage(req.body.Body);
        if (!parsedText) {
          // Empty text received
          textResp.message('Invalid command. Please try again.');
          res.send(textResp.toString());
          return;
        }

        var command = parsedText.command;
        if (isHelpRequest(command)) {
          var commandsList = listUserServlets(user);
          textResp.message('The following Servlets are ready for use:\n' + commandsList);
          res.send(textResp.toString());
          return;
        }

        // Must be a user command if we reach here
        var userServlet = findServlet(user, command);
        if (!userServlet) {
          console.log('Invalid command name');
          textResp.message('Invalid command. Please try again.');
          res.send(textResp.toString());
          return;
        }

        var servletArgs = parsedText.arguments;
        console.log('Executing user command: ' + userServlet.name);

        // FIXME: Clean this up, replace with new scheme for running Servlets
        fs.writeFile('./tmp/' + userServlet.name + '.py', userServlet.code, function postWrite(err) {
          if (err) {
            console.log(err);
            textResp.message('Error occurred running Servlet. Please try again');
            res.send(textResp.toString());
            return;
          }

          // Now run the Servlet
          servletArgs.unshift('./tmp/' + userServlet.name + '.py');
          var process = spawn('python', servletArgs);
          process.stdout.setEncoding('utf8');

          // Create callback to catch all script output
          var output = '';
          process.stdout.on('data', function catchStdout(data) {
            output += data.toString();
          });

          // Send output bundled in text response when the script is done
          // TODO: Add in forwarding to other recipients
          // TODO: Clean up returned messages on errors or no stdout
          process.on('close', function servletDone(retCode) {
            if (output && retCode === 0) {
              textResp.message(output);
              res.send(textResp.toString());
            } else {
              textResp.message('Script finished, exited with code ' + retCode);
              res.send(textResp.toString());
            }
          });
        });
      }
    });
  }
};

/*
 * ----------------
 * Helper functions
 * ----------------
 */

// Searches the given user's list of Servlets for one matching
// the desired name
function findServlet(user, servletName) {
  var servlets = user.servlets;
  var index = servlets.map(function(elem) { return elem.name; }).indexOf(servletName);
  return (index === -1) ? null : servlets[index];
}

// Parses the incoming text body for command name + arguments
function parseTextMessage(textContent) {
  var contents = textContent.split(' ');
  if (!contents) { return null; } // Empty text
  var command = contents[0];      // First token should be Servlet name
  contents.shift();               // Rest of contents should be Servlet args
  return {
    command:    command,
    arguments:  contents
  };
}

// Determines if the incoming text is a help request
function isHelpRequest(command) {
  return command === '.help';
}

// Returns a formatted list of the given user's Servlets
function listUserServlets(user) {
  var result = [];
  for (var i = 0; i < user.servlets.length; i++) {
    var servlet = user.servlets[i];
    result.push(servlet.name + ': ' + servlet.description);
  }
  return result.join('\n');
}
