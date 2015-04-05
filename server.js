'use strict';
/**
 * Module dependencies.
 */
var init 		= require('./config/init'),
	config 		= require('./config/config'),
	mongoose	= require('./config/mongoose'),
	express 	= require('./config/express'),
	passport	= require('./config/passport'),
	db 			= {},
	app 		= {};

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Init environment configuration
init();

// Load environment configuration
config = config();

// Bootstrap db connection
db = mongoose(config);

// Init the express application and sockets
app = express(config, db);

// Bootstrap passport config
passport(config);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Runestake application started on port ' + config.port);