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
	var trader = new User(bodyUser);

	// Add missing trader fields
	trader.provider = 'local';
	trader.displayName = trader.firstName + ' ' + trader.lastName;
	trader.role = enumUserRole.TRADER;

	// Then save the trader 
	trader.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			trader.password = undefined;
			trader.salt = undefined;

			res.jsonp(trader);
		}
	});
};

fnRead = function(req, res) {
	res.jsonp(req.trader);
};

fnUpdate = function(req,res,next){

	var trader = req.trader;
	// For security measurement only get some fields from body
	var bodyUser = _.pick(req.body, 'firstName', 'lastName', 'email', 'rank');

	// Map body request fields to model object
	trader = _.extend(trader, bodyUser);

	// Add missing user fields
	trader.displayName = trader.firstName + ' ' + trader.lastName;

	trader.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			trader.password = undefined;
			trader.salt = undefined;

			res.jsonp(trader);
		}
	});
};

fnDelete = function(req,res,next){
	var trader = req.trader;

	trader.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trader);
		}
	});
};

fnList = function(req,res,next){
	User.find({role: enumUserRole.TRADER})
		// .populate('firstName lastName username email rank')
		.sort('-created')
		.exec(function(err, objList) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(objList);
			}
		});
};

fnObjectByID = function(req, res, next, id) {
	User.findById(id)
	// .populate('firstName lastName username email rank')
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