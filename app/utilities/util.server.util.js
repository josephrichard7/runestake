'use strict';

var Util = {};

var mongoose 		= require('mongoose'),
	errorUtil = require('../utilities/error');

module.exports = Util;

Util.ARRAY_HITVALUE = [
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	24,
	25
];

/**
 * Return a javascript object
 */
Util.fnResultToObject = function(result) {
	var returnObject;

	if(result instanceof mongoose.Model){
		returnObject = result.toObject();
	}else if(result instanceof Array){
		returnObject = result.map(function(obj){
			if(obj instanceof mongoose.Model){
				return obj.toObject();
			}
		});
	}else{
		returnObject = result;
	}
	return returnObject;
};

/**
 * Error handler after action execution in database. Return a javascript object
 */
Util.fnProcessResultService = function(err, result, callback) {
	var returnObject;

	if (err){
		callback(err);
	}else{
		if(result instanceof mongoose.Model){
			returnObject = result.toObject();
		}else if(result instanceof Array){
			returnObject = result.map(function(obj){
				if(obj instanceof mongoose.Model){
					return obj.toObject();
				}
			});
		}else{
			returnObject = result;
		}
		
		callback(null, returnObject || {});
	}
};


/**
 * Common Processing of the result returned by business service
 */
Util.fnProcessServicePromiseInController = function(promise,res){
	
	return promise.then(function(result){
		return res.jsonp(Util.fnResultToObject(result));
	}).then(null, function (err) {
		errorUtil.fnHandleErrorMW(err,res);
	});
};

/**
 * Common Processing of the result returned by business service
 */
Util.fnProcessResultController = function(err, res, result){
	if(err){
		return errorUtil.fnHandleErrorMW(err,res);
	}else{
		res.jsonp(result);			
	}
};