'use strict';

/**
 * Module dependencies.
 */
var userController   	= require('../controllers/users'),
	stakeController 	= require('../controllers/stake'),
	enumUserrole		= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Stake Routes
	app.route('/stake/:id')
	.get(
		userController.hasAuthorization([enumUserrole.GAMBLER]), 
		stakeController.fnReadByID
	);
	
};