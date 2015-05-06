'use strict';

/**
 * Module dependencies.
 */
var userController  		= require('../controllers/users'),
	transactionController 	= require('../controllers/transaction'),
	enumUserrole			= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Transaction Routes
	app.route('/transaction/user/:userId').get(
		userController.hasAuthorization([enumUserrole.ADMIN]), 
		transactionController.fnList
	);

	app.route('/transaction').get(
		userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER, enumUserrole.BANK]), 
		transactionController.fnList
	);

	app.route('/transaction/:id').get(
		userController.hasAuthorization([enumUserrole.ADMIN]), 
		transactionController.fnReadById
	);
};