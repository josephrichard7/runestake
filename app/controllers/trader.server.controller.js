'use strict';

var TraderController = {};

/**
 * Module dependencies.
 */
var util 		 	= require('../utilities/util'),
	traderService 	= require('../services/trader');

module.exports = TraderController;

TraderController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = traderService.fnReadByID(id);

	util.fnProcessServicePromiseInController(promise, res);
};

TraderController.fnCreate = function(req,res){
	var requestVO 	= req.body;
	var promise 	= traderService.fnCreate(requestVO);

	util.fnProcessServicePromiseInController(promise, res);
};

TraderController.fnRead = function(req, res) {
	var requestVO 	= req.body;
	var promise 	= traderService.fnRead(requestVO);

	util.fnProcessServicePromiseInController(promise, res);
};

TraderController.fnUpdate = function(req,res){
	var requestVO 	= req.body;
	var promise 	= traderService.fnUpdate(requestVO);

	util.fnProcessServicePromiseInController(promise, res);
};

TraderController.fnDelete = function(req,res){
	var id 		= req.params.id || req.body.id;
	var promise = traderService.fnDelete(id);

	util.fnProcessServicePromiseInController(promise, res);
};

TraderController.fnList = function(req,res){
	var promise = traderService.fnList();

	util.fnProcessServicePromiseInController(promise, res);
};