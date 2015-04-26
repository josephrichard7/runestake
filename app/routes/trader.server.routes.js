'use strict';

/**
 * Module dependencies.
 */
var userController   = require('../controllers/users'),
	traderController = require('../controllers/trader'),
	enumUserrole		= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Trader Routes
	app.route('/trader').post(userController.hasAuthorization([enumUserrole.ADMIN]), traderController.fnCreate)
						.get (userController.hasAuthorization([enumUserrole.ADMIN]), traderController.fnList);

	app.route('/trader/:id').get   (userController.hasAuthorization([enumUserrole.ADMIN, enumUserrole.TRADER]), traderController.fnReadByID)
							.put   (userController.hasAuthorization([enumUserrole.ADMIN]), traderController.fnUpdate)
							.delete(userController.hasAuthorization([enumUserrole.ADMIN]), traderController.fnDelete);
};