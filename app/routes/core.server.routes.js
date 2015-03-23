'use strict';

module.exports = function(app) {
	// Root routing
	var coreController = require('../controllers/core');
	app.route('/').get(coreController.index);
};