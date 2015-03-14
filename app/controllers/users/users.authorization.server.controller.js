'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
// exports.hasAuthorization = function(roles) {
// 	var _this = this;

// 	return function(req, res, next) {
// 	    var user = _this.userByID(req,res, function(){
// 			_this.requiresLogin(req, res, function() {
// 				if (_.intersection(user.role, roles).length) {
// 					return next();
// 				} else {
// 					return res.status(403).send({
// 						message: 'User is not authorized'
// 					});
// 				}
// 			});
// 		},req.user._id);
// 	};
// };
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
	    _this.userByID(req,res, function(){
			_this.requiresLogin(req, res, function() {
				if (_.intersection([req.profile.role], roles).length) {
					return next();
				} else {
					return res.status(403).send({
						message: 'User is not authorized'
					});
				}
			});
		},req.user.id);
	};
};