'use strict';

/**
 * Module dependencies.
 */
var _ 				  = require('lodash'),
	enumUserstate 	  = require('../utilities/enums/userstate'),
	enumTraderrank 	  = require('../utilities/enums/traderrank'),
	enumChatevent 	  = require('../utilities/enums/chatevent');

/**
 * Functions
 */
var fnGetEnum;

fnGetEnum = function(req,res){
	var enumName = req.params.enumName;
	var result   = [];

	switch(enumName){
		case 'userstate': 
			result = _.values(enumUserstate);
			break;
		case 'traderrank':
			result = _.values(enumTraderrank);
			break;
		case 'chatevent':
			result = _.values(enumChatevent);
			break;		
		default:
			result = [];
	}
	res.jsonp({data: result});
};

exports.fnGetEnum	 = fnGetEnum;