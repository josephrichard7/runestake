'use strict';

angular.module(ApplicationConfiguration.modules.exchangerate)
.service(ApplicationConfiguration.services.exchangerate, [
	'$resource',
	function($resource) {
		var _this = this;

		var ExchangeRateSellerTraderResource 	= $resource('exchangerate/trader/:sCurrency/:dCurrency');
		var ExchangeRateSellerBankResource 		= $resource('exchangerate/bank/:sCurrency/:dCurrency');

		_this.fnReadForSellerTrader = function(sourceCurrency, destinationCurrency){
			return ExchangeRateSellerTraderResource.get({
				sCurrency: 	sourceCurrency,
				dCurrency: 	destinationCurrency
			}).$promise;
		};

		_this.fnReadForSellerBank = function(sourceCurrency, destinationCurrency){
			return ExchangeRateSellerBankResource.get({
				sCurrency: 	sourceCurrency,
				dCurrency: 	destinationCurrency
			}).$promise;
		};
	}
]);