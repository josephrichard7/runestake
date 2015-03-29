'use strict';
/**
 * Module dependencies.
 */
var init 		= {},
	config 		= {},
	mongoose 	= require('mongoose'),
	db 			= {},
	app 		= {};

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Init environment configuration
init 	= require('./config/init')();
config 	= require('./config/config');

// Bootstrap db connection
db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application and sockets
app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);