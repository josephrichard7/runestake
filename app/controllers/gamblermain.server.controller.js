'use strict';

/**
 * Module dependencies.
 */
var _ 				  = require('lodash'),
	util 		 	  = require('../utilities/util'),
	gamblerService 	  = require('../services/gamblermain'),
	enumUserRole 	  = require('../utilities/enums/userrole');

/**
 * Functions
 */
var fnReadByID,
	hasAuthorization;

fnReadByID = function(req, res) {
	var id = req.params.id || req.body.id;

	gamblerService.fnReadByID(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

hasAuthorization = function(req,res,next){
	var userId 			= req.params.id || req.body.id;
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
exports.hasAuthorization	= hasAuthorization;