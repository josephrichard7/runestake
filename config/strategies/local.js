'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('mongoose').model('User'),
	enumUserState = require('../../app/util/userstate');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
			User.findOne({
				username: username
			}, function(err, user) {
				var errmessage;

				if (err) {
					return done(err);
				}
				else if (!user) {
					errmessage = 'Unknown user';
				}
				else if (!user.authenticate(password)) {
					errmessage = 'Invalid password';
				}
				else if (user.state === enumUserState.INACTIVE){
					errmessage = 'Your user have been inactive';
				}
				else if (user.state === enumUserState.BANNED){
					errmessage = 'Your user have been banned';
				}
				else if (user.state === enumUserState.DELETED){
					errmessage = 'Your user have been deleted';
				}

				if(errmessage){
					return done(null, false, {
						message: errmessage
					});
				}

				return done(null, user);
			});
		}
	));
};