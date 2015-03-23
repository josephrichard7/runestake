'use strict';

/**
 * Module dependencies.
 */
var userController 	= require('../controllers/users'),
	enumController 	= require('../controllers/enum');

module.exports = function(app) {
	// Enum Routes
	app.route('/enum/:enumName').get(userController.hasAuthorization(['ADMIN']), enumController.fnGetEnum);
};