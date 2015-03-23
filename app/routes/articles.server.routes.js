'use strict';

/**
 * Module dependencies.
 */
var userController 		= require('../controllers/users'),
	articlesController 	= require('../controllers/articles');

module.exports = function(app) {
	// Article Routes
	app.route('/articles')
		.get(userController.hasAuthorization(['ADMIN','GAMBLER']), articlesController.list)
		.post(userController.hasAuthorization(['GAMBLER']), articlesController.create);

	app.route('/articles/:articleId')
		.get(articlesController.read)
		.put(userController.requiresLogin, articlesController.hasAuthorization, articlesController.update)
		.delete(userController.requiresLogin, articlesController.hasAuthorization, articlesController.delete);

	// Finish by binding the article middleware
	app.param('articleId', articlesController.articleByID);
};