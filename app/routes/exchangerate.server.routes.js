'use strict';

/**
 * Module dependencies.
 */
var userController   		= require('../controllers/users'),
	exchangeRateController 	= require('../controllers/exchangerate'),
	enumUserrole			= require('../utilities/enums/userrole');

module.exports = function(app) {
	// Exchangerate Routes
	app.route('/exchangerate/trader/:sCurrency/:dCurrency')
	.get(userController.hasAuthorization([enumUserrole.GAMBLER, enumUserrole.TRADER, enumUserrole.BANK]), exchangeRateController.fnReadForSellerTrader);

	app.route('/exchangerate/bank/:sCurrency/:dCurrency')
	.get(userController.hasAuthorization([enumUserrole.TRADER, enumUserrole.BANK]), exchangeRateController.fnReadForSellerBank);
};