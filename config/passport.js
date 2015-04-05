'use strict';

var passport 	= require('passport'),
	mongoose 	= require('mongoose'),
	path 		= require('path');

module.exports = function(config) {
	var User = mongoose.model('User');

	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
	config.getGlobbedFiles(config.appPaths.passportStrategies).forEach(function(strategy) {
		require(path.resolve(strategy))(config);
	});
};