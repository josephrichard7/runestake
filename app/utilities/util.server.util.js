'use strict';

var mongoose 		= require('mongoose'),
	errorUtil = require('../utilities/error');

var fnProcessResultService	  = function(){},
	fnProcessResultController = function(){};

/**
 * Error handler after action execution in database. Return a javascript object
 */
fnProcessResultService = function(err, result, callback) {
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
fnProcessResultController = function(err, res, result){
	if(err){
		return errorUtil.fnHandleErrorMW(err,res);
	}else{
		res.jsonp(result);			
	}
};

exports.fnProcessResultService		= fnProcessResultService;
exports.fnProcessResultController	= fnProcessResultController;