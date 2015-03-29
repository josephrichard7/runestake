'use strict';

/**
 * Module dependencies.
 */
var userController 	= require('../controllers/users'),
	enumController 	= require('../controllers/enum'),
	enumUserrole	= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Enum Routes
	app.route('/enum/:enumName').get(userController.hasAuthorization([enumUserrole.ADMIN,enumUserrole.GAMBLER]), enumController.fnGetEnum);
};