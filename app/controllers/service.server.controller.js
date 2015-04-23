'use strict';

var ServiceController = {};

/**
 * Module dependencies.
 */
var util 		 	  	= require('../utilities/util'),
	enumUserRole		= require('../utilities/enums/userrole'),
	serviceService 		= require('../services/service');

module.exports	= ServiceController;

ServiceController.fnAssignTrader = function(req,res){
	var requestVO 	= req.body;
	var promise 	= serviceService.fnUpdate(requestVO);

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnCancelar = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = serviceService.fnCancelar(id);

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnCreate = function(req,res){
	var requestVO 	= req.body;
	var promise 	= {};

	requestVO.gambler = req.user.id;

	promise = serviceService.fnCreate(requestVO); 

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnList = function(req,res){
	var id 		= req.user.id || req.params.id || req.body.id;
	var promise = {};

	if(req.user.role === enumUserRole.GAMBLER){
		promise = serviceService.fnListByGambler(id);
	}else if(req.user.role === enumUserRole.TRADER){
		promise = serviceService.fnListByTrader(id);
	}

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = serviceService.fnReadByID(id);

	util.fnProcessServicePromiseInController(promise, res);
};