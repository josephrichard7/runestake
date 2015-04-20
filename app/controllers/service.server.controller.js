'use strict';

var ServiceController = {};

/**
 * Module dependencies.
 */
var util 		 	  	= require('../utilities/util'),
	enumUserRole		= require('../utilities/enums/userrole'),
	serviceService 		= require('../services/service');

module.exports	= ServiceController;

ServiceController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = serviceService.fnReadByID(id);

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnCancelar = function(req, res) {
	var id = req.params.id || req.body.id;

	serviceService.fnCancelar(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

ServiceController.fnCreate = function(req,res){
	var requestVO 	= req.body;
	var promise 	= {};

	requestVO.gambler = req.user.id;

	promise = serviceService.fnCreate(requestVO); 

	util.fnProcessServicePromiseInController(promise, res);
};

ServiceController.fnRead = function(req, res) {
	var requestVO = req.body;

	serviceService.fnRead(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

ServiceController.fnUpdate = function(req,res){
	var requestVO = req.body;

	serviceService.fnUpdate(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

ServiceController.fnDelete = function(req,res){
	var id = req.params.id || req.body.id;

	serviceService.fnDelete(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

ServiceController.fnList = function(req,res){
	var id = req.user.id || req.params.id || req.body.id;

	if(req.user.role === enumUserRole.GAMBLER){
		serviceService.fnListByGambler(id, function(err, resultVO){
			return util.fnProcessResultController(err, res, resultVO);
		});	
	}else if(req.user.role === enumUserRole.TRADER){
		serviceService.fnListByTrader(id, function(err, resultVO){
			return util.fnProcessResultController(err, res, resultVO);
		});		
	}
};