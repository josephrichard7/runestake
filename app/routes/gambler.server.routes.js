'use strict';

/**
 * Module dependencies.
 */
var userController   	= require('../controllers/users'),
	gamblerController	= require('../controllers/gambler'),
	enumUserrole		= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Gamblermain Routes

	app.route('/gambler/:id')
	.get(userController.hasAuthorization([enumUserrole.ADMIN,enumUserrole.GAMBLER]), gamblerController.hasAuthorization, gamblerController.fnReadByID);
};