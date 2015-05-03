'use strict';

/**
 * Module dependencies.
 */
var _ 				  		= require('lodash'),
	enumChatevent 	  		= require('../utilities/enums/chatevent'),
	enumServicesSocketEvent = require('../utilities/enums/servicessocketevent'),
	enumServiceState 	  	= require('../utilities/enums/servicestate'),
	enumTraderrank 	  		= require('../utilities/enums/traderrank'),
	enumUserRole 	  		= require('../utilities/enums/userrole'),
	enumUserstate 	  		= require('../utilities/enums/userstate');

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
		case 'chatevent':
			enumObj = enumChatevent;
			break;
		case 'servicessocketevent':
			enumObj = enumServicesSocketEvent;
			break;
		case 'servicestate':
			enumObj = enumServiceState;
			break;
		case 'traderrank':
			enumObj = enumTraderrank;
			break;
		case 'userrole':
			enumObj = enumUserRole;
			break;
		case 'userstate': 
			enumObj = enumUserstate;
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