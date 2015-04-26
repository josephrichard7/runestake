'use strict';

var GamblermainController = {};
/**
 * Module dependencies.
 */
var util 		 	  = require('../utilities/util'),
	gamblerService 	  = require('../services/gamblermain'),
	enumUserRole 	  = require('../utilities/enums/userrole');	

module.exports = GamblermainController;

GamblermainController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = gamblerService.fnReadByID(id);

	util.fnProcessServicePromiseInController(promise, res);
};

GamblermainController.hasAuthorization = function(req,res,next){
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