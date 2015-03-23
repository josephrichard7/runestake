'use strict';

/**
 * Module dependencies.
 */
var passport 		= require('passport'),
	enumUserRole 	= require('../utilities/enums/userrole'),
	userController 	= require('../controllers/users');

module.exports = function(app) {
	// User Routes

	// Setting up the users profile api
	app.route('/users/me').get(userController.me);
	app.route('/users').put(userController.update);
	app.route('/users/accounts').delete(userController.removeOAuthProvider);

	// Setting up the users password api
	app.route('/users/password').post(userController.changePassword);
	app.route('/auth/forgot').post(userController.forgot);
	app.route('/auth/reset/:token').get(userController.validateResetToken);
	app.route('/auth/reset/:token').post(userController.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(userController.signup(enumUserRole.GAMBLER));
	app.route('/auth/signin').post(userController.signin);
	app.route('/auth/signout').get(userController.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(userController.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(userController.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(userController.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(userController.oauthCallback('linkedin'));
	
	// Setting the github oauth routes
	app.route('/auth/github').get(passport.authenticate('github'));
	app.route('/auth/github/callback').get(userController.oauthCallback('github'));

	// Finish by binding the user middleware
	app.param('userId', userController.userByID);
};
