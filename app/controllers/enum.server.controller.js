'use strict';

/**
 * Module dependencies.
 */
var _ 				  = require('lodash'),
	enumUserstate 	  = require('../utilities/enums/userstate'),
	enumTraderrank 	  = require('../utilities/enums/traderrank'),
	enumChatevent 	  = require('../utilities/enums/chatevent');

module.exports.fnGetEnum = fnGetEnum;

/*jshint latedef: false */
function fnGetEnum(req,res){
	var enumName = req.params.name;
	var enumType = req.params.type;
	var result;

	switch(enumType){
		case 'ARRAY':
			result = fnGetEnumByType(enumName, _.values);
			break;
		case 'OBJECT':
			result = fnGetEnumByType(enumName);
			break;
		default:
			result = fnGetEnumByType(enumName, _.values);
	}

	res.jsonp(result);
}

function fnGetEnumByType(enumName, castFunction){
	var result  	= {};
	var enumObj 	= {};

	switch(enumName){
		case 'userstate': 
			enumObj = enumUserstate;
			break;
		case 'traderrank':
			enumObj = enumTraderrank;
			break;
		case 'chatevent':
			enumObj = enumChatevent;
			break;		
		default:
			enumObj = {};
	}
	result = {
		data: cast(enumObj, castFunction)
	};
	return result;
}

function cast(obj, fn){
	if(fn){
		return fn(obj);
	}else{
		return obj;
	}
}