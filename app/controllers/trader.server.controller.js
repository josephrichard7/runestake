'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	enumUserRole = require('../../app/util/userrole');

/**
 * Functions
 */
var fnCreate,
	fnRead,
	fnUpdate,
	fnDelete,
	fnList,
	fnObjectByID,
	fnHasAuthorization;

fnCreate = function(req,res,next){

	// For security measurement only get some fields from body
	var bodyUser = _.pick(req.body, 'firstName', 'lastName','username', 'email', 'password', 'rank');

	// Init Model
	var user = new User(bodyUser);

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;
	user.role = enumUserRole.TRADER;

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			res.jsonp(user);
		}
	});
};

fnRead = function(req, res) {
	res.jsonp(req.trader);
};

fnUpdate = function(req,res,next){

	// For security measurement only get some fields from body
	var bodyUser = _.pick(req.body, 'id', 'firstName', 'lastName', 'email', 'rank');

	// Init Variables
	var user = new User(bodyUser);

	// Add missing user fields
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			res.jsonp(user);
		}
	});
};

fnDelete = function(req,res,next){
	var user = req.trader;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(user);
		}
	});
};

fnList = function(req,res,next){
	User.find({role: enumUserRole.TRADER})
		.sort('-created')
		// .populate('firstName', 'lastName','username', 'email', 'rank')
		.exec(function(err, users) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(users);
			}
		});
};

fnObjectByID = function(req, res, next, id) {
	User.findById(id)
	// .populate('firstName', 'lastName','username', 'email', 'rank')
	.exec(function(err, obj) {
		if (err) return next(err);
		if (!obj) return next(new Error('Failed to load trader user ' + id));
		req.trader = obj;
		next();
	});
};

exports.fnCreate     = fnCreate;
exports.fnRead       = fnRead;
exports.fnUpdate     = fnUpdate;
exports.fnDelete     = fnDelete;
exports.fnList       = fnList;
exports.fnObjectByID = fnObjectByID;
// exports.fnHasAuthorization = fnHasAuthorization;