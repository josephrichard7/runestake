'use strict';

/**
 * Module dependencies.
 */
var userController = require('../../app/controllers/users'),
	traderController = require('../../app/controllers/trader');

module.exports = function(app) {
	// Trader Routes
	app.route('/trader').post(userController.hasAuthorization(['ADMIN']), traderController.fnCreate)
						.get (userController.hasAuthorization(['ADMIN']), traderController.fnList);

	app.route('/trader/:traderId').get   (userController.hasAuthorization(['ADMIN']), traderController.fnRead)
								  .put   (userController.hasAuthorization(['ADMIN']), traderController.fnUpdate)
								  .delete(userController.hasAuthorization(['ADMIN']), traderController.fnDelete);

	// Finish by binding the article middleware
	app.param('traderId', traderController.fnObjectByID);
};