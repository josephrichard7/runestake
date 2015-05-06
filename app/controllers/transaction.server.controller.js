'use strict';

var TransactionController = {};

/**
 * Module dependencies.
 */
var util 		 		= require('../utilities/util'),
	transactionService 	= require('../services/transaction');

module.exports = TransactionController;

TransactionController.fnList = function(req,res){
	var userId	= req.params.userId || req.user.id;
	var promise = transactionService.fnList(userId);

	util.fnProcessServicePromiseInController(promise, res);
};

TransactionController.fnReadById = function(req, res) {
	var id 		= req.params.id;
	var promise = transactionService.fnReadById(id);

	util.fnProcessServicePromiseInController(promise, res);
};