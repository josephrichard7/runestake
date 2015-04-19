'use strict';

/**
 * Module dependencies.
 */
var userController   	= require('../controllers/users'),
	serviceController 	= require('../controllers/service'),
	enumUserrole		= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Service Routes
	app.route('/service').post(userController.hasAuthorization([enumUserrole.GAMBLER]), serviceController.fnCreate)
						 .get (userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER]), serviceController.fnList);

	app.route('/service/:id').get(
		userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER]),
		serviceController.fnReadByID
	);

	app.route('/service/:id/cancelar').put(
		userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER]),
		serviceController.fnCancelar
	);
};