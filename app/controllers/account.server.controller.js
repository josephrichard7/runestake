'use strict';

var AccountController = {};

/**
 * Module dependencies.
 */
var util 		 	  = require('../utilities/util'),
	accountService 	  = require('../services/account'),
	enumUserRole 	  = require('../utilities/enums/userrole');

module.exports = AccountController;

AccountController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = accountService.fnReadByID(id);

	util.fnProcessServicePromiseInController(promise, res);
};

// AccountController.fnCreate = function(req,res){
// 	var requestVO 	= req.body;
// 	var promise 	= accountService.fnCreate(requestVO);

// 	util.fnProcessServicePromiseInController(promise, res);
// };

// AccountController.fnUpdate = function(req,res){
// 	var requestVO 	= req.body;
// 	var promise 	= accountService.fnUpdate(requestVO);

// 	util.fnProcessServicePromiseInController(promise, res);
// };

AccountController.fnReadByUserId = function(req, res) {
	var userId 	= req.params.userId || req.body.userId;
	var promise = accountService.fnReadByUserId(userId);

	util.fnProcessServicePromiseInController(promise, res);
};

AccountController.hasAuthorization = function(req,res,next){
	var userId 			= req.params.userId || req.body.userId || req.params.id || req.body.id;
	var userIdLogged	= req.user.id;

	// Admin user can do any request, but it should validate the user account requested.
	if(req.user.role !== enumUserRole.ADMIN){
		// If userId account requested is not equal to user logged, refused request.
		if(userId !== userIdLogged){
			return res.status(403).send({
				message: 'User is not authorized'
			});
		}
	}
	next();
};