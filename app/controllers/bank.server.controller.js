'use strict';

var BankController = {};

/**
 * Module dependencies.
 */
var util 		 	= require('../utilities/util'),
	bankService 	= require('../services/bank');

module.exports = BankController;

BankController.fnLoadChips = function(req,res){
	var requestVO 	= req.body;
	var promise 	= bankService.fnLoadChips(requestVO);

	util.fnProcessServicePromiseInController(promise, res);
};

BankController.fnRead = function(req, res) {
	var promise 	= bankService.fnRead();

	util.fnProcessServicePromiseInController(promise, res);
};

BankController.fnUpdate = function(req,res){
	var requestVO 	= req.body;
	var promise 	= bankService.fnUpdate(requestVO);

	util.fnProcessServicePromiseInController(promise, res);
};