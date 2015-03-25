'use strict';

/**
 * Module dependencies.
 */
var userController   	= require('../controllers/users'),
	accountController	= require('../controllers/account'),
	enumUserrole		= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Account Routes

	app.route('/account/:id')
	.get(
		userController.hasAuthorization([enumUserrole.ADMIN,enumUserrole.GAMBLER]),
		accountController.hasAuthorization,
		accountController.fnReadByID
	);

	app.route('/account/user/:userId')
	.get(
		userController.hasAuthorization([enumUserrole.ADMIN,enumUserrole.GAMBLER]),
		accountController.hasAuthorization,
		accountController.fnReadByUserId
	);				 
};