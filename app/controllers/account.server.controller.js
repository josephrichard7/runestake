'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('./errors'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Account = mongoose.model('Account');

/**
 * Functions
 */
var fnCreate,
	fnRead,
	fnUpdate,
	fnObjectByID;

fnCreate = function(req, res){

	var account = new Account(req.account);
	account.user = user;
	account.balance = 0;

	// Then save the trader 
	account.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(account);
		}
	});
};

fnRead = function(req, res) {
	res.jsonp(_.pick(req.trader,'_id', 'firstName', 'lastName', 'username', 'email', 'rank', 'state', 'created', 'updated'));
};

fnUpdate = function(req,res,next){

	var trader = req.trader;
	// For security measurement only get some fields from body
	var bodyUser = _.pick(req.body, 'firstName', 'lastName', 'email', 'rank', 'state');

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
			// Remove sensitive data
			trader.password = undefined;
			trader.salt = undefined;

			res.jsonp(trader);
		}
	});
};

fnDelete = function(req,res,next){
	var trader = req.trader;

	trader.state = enumUserState.DELETED;

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

	// trader.remove(function(err) {
	// 	if (err) {
	// 		return res.status(400).send({
	// 			message: errorHandler.getErrorMessage(err)
	// 		});
	// 	} else {
	// 		res.jsonp(trader);
	// 	}
	// });
};

fnList = function(req,res,next){
	User.where('role').equals(enumUserRole.TRADER)
		.where('state').nin([enumUserState.DELETED])
		.select('_id firstName lastName username email rank state')
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
	 //    .where('role').equals(enumUserRole.TRADER)
		// .where('state').nin([enumUserState.DELETED])
		.select('-password -salt')	// Avoid password re-encryptation 
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