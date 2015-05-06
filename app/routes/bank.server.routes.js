'use strict';

/**
 * Module dependencies.
 */
var userController  = require('../controllers/users'),
	bankController 	= require('../controllers/bank'),
	enumUserrole	= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Bank Routes
	app.route('/bank').get(userController.hasAuthorization([enumUserrole.ADMIN]), bankController.fnRead)
					  .put(userController.hasAuthorization([enumUserrole.ADMIN]), bankController.fnUpdate);

	app.route('/bank/loadchips').post(
		userController.hasAuthorization([enumUserrole.ADMIN]), 
		bankController.fnLoadChips
	);
};