'use strict';

/**
 * Module dependencies.
 */
var userController   = require('../controllers/users'),
	traderController = require('../controllers/trader');

module.exports = function(app) {
	// Trader Routes
	app.route('/trader').post(userController.hasAuthorization(['ADMIN']), traderController.fnCreate)
						.get (userController.hasAuthorization(['ADMIN']), traderController.fnList);

	app.route('/trader/:id').get   (userController.hasAuthorization(['ADMIN']), traderController.fnReadByID)
							.put   (userController.hasAuthorization(['ADMIN']), traderController.fnUpdate)
							.delete(userController.hasAuthorization(['ADMIN']), traderController.fnDelete);
};