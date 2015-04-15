'use strict';

/**
 * Module dependencies.
 */
var util 		 	  = require('../utilities/util'),
	traderService 	  = require('../services/trader');

/**
 * Functions
 */
var fnReadByID,
	fnCreate,
	fnRead,
	fnUpdate,
	fnDelete,
	fnList;

fnReadByID = function(req, res) {
	var id = req.params.id || req.body.id;

	traderService.fnReadByID(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnCreate = function(req,res){
	var requestVO = req.body;

	traderService.fnCreate(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnRead = function(req, res) {
	var requestVO = req.body;

	traderService.fnRead(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnUpdate = function(req,res){
	var requestVO = req.body;

	traderService.fnUpdate(requestVO, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnDelete = function(req,res){
	var id = req.params.id || req.body.id;

	traderService.fnDelete(id, function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

fnList = function(req,res){
	traderService.fnList(function(err, resultVO){
		return util.fnProcessResultController(err, res, resultVO);
	});
};

exports.fnReadByID 	= fnReadByID;
exports.fnCreate    = fnCreate;
exports.fnRead      = fnRead;
exports.fnUpdate    = fnUpdate;
exports.fnDelete	= fnDelete;
exports.fnList      = fnList;