The New and Improved Serve Platform
===================================

TODO
----
  - Convert todo list management to Github issues
  - Configure use of nodemon for running server

Development Notes
-----------------
Gulp is configured as a general launcher for useful tasks such as linting and
running the server.

To run the server:  `gulp start`
To run linting:     `gulp lint`
To format a file:   `gulp format --file path/to/file`
To run mocha tests: `gulp mocha`

The server is run using nodemon, and is configured to automatically restart
whenever any changes are made to .js or .html files
