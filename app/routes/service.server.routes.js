'use strict';

/**
 * Module dependencies.
 */
var userController   	= require('../controllers/users'),
	serviceController 	= require('../controllers/service'),
	enumUserrole		= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Service Routes
	app.route('/service/listrequestinguser')
	.get (
		userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER]), 
		serviceController.fnListRequestingUser
	);

	app.route('/service/listattendantuser')
	.get (
		userController.hasAuthorization([enumUserrole.TRADER, enumUserrole.BANK]),
		serviceController.fnListAttendantUser
	);

	app.route('/service/:id')
	.get(
		userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER, enumUserrole.BANK]), 
		serviceController.fnReadByID
	);
	
	app.route('/service/:id/desist')
	.put(userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER]), serviceController.fnDesist);
};