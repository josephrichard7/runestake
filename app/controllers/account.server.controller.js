'use strict';

/**
 * Module dependencies.
 */
var _ 				  = require('lodash'),
	util 		 	  = require('../utilities/util'),
	accountService 	  = require('../services/account'),
	enumUserRole 	  = require('../utilities/enums/userrole');

/**
 * Functions
 */
var fnReadByID,
	fnCreate,
	fnUpdate,
	fnReadByUserId,
	hasAuthorization;

fnReadByID = function(req, res) {
	var id = req.params.id || req.body.id;

	accountService.fnReadByID(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnCreate = function(req,res){
	var requestVO = req.body;

	accountService.fnCreate(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnUpdate = function(req,res){
	var requestVO = req.body;

	accountService.fnUpdate(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnReadByUserId = function(req, res) {
	var userId = req.params.userId || req.body.userId;

	accountService.fnReadByUserId(userId, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

hasAuthorization = function(req,res,next){
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

exports.fnReadByID 			= fnReadByID;
exports.fnReadByUserId 		= fnReadByUserId;
exports.hasAuthorization	= hasAuthorization;