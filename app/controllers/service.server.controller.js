'use strict';

var ServiceController = {};

/**
 * Module dependencies.
 */
var util 		 	  	= require('../utilities/util'),
	enumUserRole		= require('../utilities/enums/userrole'),
	serviceService 		= require('../services/service');

module.exports	= ServiceController;

// ServiceController.fnAssignTrader = function(req,res){
// 	var requestVO 	= req.body;
// 	var promise 	= serviceService.fnUpdate(requestVO);

// 	util.fnProcessServicePromiseInController(promise, res);
// };

// ServiceController.fnCancelar = function(req, res) {
// 	var id 		= req.params.id || req.body.id;
// 	var promise = serviceService.fnCancelar(id);

// 	util.fnProcessServicePromiseInController(promise, res);
// };

ServiceController.fnCreate = function(req,res){
	var requestVO 	= req.body;
	var promise 	= {};

	requestVO.gambler = req.user.id;

	promise = serviceService.fnCreate(requestVO); 

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnDesist = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = serviceService.fnDesist(id);

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnListRequestingUser = function(req,res){
	var id 		= req.user.id || req.params.id || req.body.id;
	var promise = {};

	if(req.user.role === enumUserRole.GAMBLER){
		promise = serviceService.fnListByRequestingUser(id);
	}else if(req.user.role === enumUserRole.TRADER){
		promise = serviceService.fnListByRequestingUser(id);
	}

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnListAttendantUser = function(req,res){
	var id 		= req.user.id || req.params.id || req.body.id;
	var promise = {};

	if(req.user.role === enumUserRole.BANK){
		promise = serviceService.fnListByAttendantUser(id);
	}else if(req.user.role === enumUserRole.TRADER){
		promise = serviceService.fnListByAttendantUser(id);
	}

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = {};

	if(req.user.role === enumUserRole.GAMBLER){
		promise = serviceService.fnReadByIDByGambler(id);
	}else{
		promise = serviceService.fnReadByID(id);
	}

	util.fnProcessServicePromiseInController(promise, res);
};