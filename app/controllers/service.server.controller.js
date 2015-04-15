'use strict';

var ServiceController = {};

/**
 * Module dependencies.
 */
var util 		 	  = require('../utilities/util'),
	serviceService 	  = require('../services/service');

module.exports	= ServiceController;

ServiceController.fnReadByID = function(req, res) {
	var id = req.params.id || req.body.id;

	serviceService.fnReadByID(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

ServiceController.fnCreate = function(req,res){
	var requestVO = req.body;

	serviceService.fnCreate(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
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
	serviceService.fnList(function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};