'use strict';

var StakeController = {};
/**
 * Module dependencies.
 */
var util 		 	  = require('../utilities/util'),
	stakeService 	  = require('../services/stake');

module.exports = StakeController;

StakeController.fnReadByID = function(req, res) {
	var id 		= req.params.id || req.body.id;
	var promise = stakeService.fnReadById(id);

	util.fnProcessServicePromiseInController(promise, res);
};