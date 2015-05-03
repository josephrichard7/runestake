'use strict';

var ExchangerateController = {};

/**
 * Module dependencies.
 */
var util 				= require('../utilities/util'),
	enumUserRole		= require('../utilities/enums/userrole'),
	exchangeRateService = require('../services/exchangerate');

module.exports	= ExchangerateController;

ExchangerateController.fnReadForSellerTrader = function(req, res) {
	var sourceCurrency		= req.params.sCurrency;
	var destinationCurrency	= req.params.dCurrency;
	var promise 			= exchangeRateService.fnRead(enumUserRole.TRADER, sourceCurrency, destinationCurrency);

	util.fnProcessServicePromiseInController(promise, res);
};

ExchangerateController.fnReadForSellerBank = function(req, res) {
	var sourceCurrency		= req.params.sCurrency;
	var destinationCurrency	= req.params.dCurrency;
	var promise 			= exchangeRateService.fnRead(enumUserRole.BANK, sourceCurrency, destinationCurrency);

	util.fnProcessServicePromiseInController(promise, res);
};