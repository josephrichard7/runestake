'use strict';

var ExchangeRateService = {};

/**
 * Module dependencies.
 */
var Promise				= require('bluebird'),
	mongoose 			= require('mongoose'),
	ExchangeRateEntity 	= mongoose.model('ExchangeRate');

module.exports = ExchangeRateService;

ExchangeRateService.fnRead = function(sellerRole, sourceCurrency, destinationCurrency) {
	return ExchangeRateEntity
	.findOne()
	.where('sellerRole').equals(sellerRole)
	.where('sourceCurrency').equals(sourceCurrency)
	.where('destinationCurrency').equals(destinationCurrency)
	.where('fromDate').lt(Date.now())
	.sort('-fromDate')
	.select('-fromDate -createdDate -sellerRole -id')	
	.exec();
};