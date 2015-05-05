'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.trader)
.config([
	'$stateProvider',
	function($stateProvider) {
		// Trader state routing
		$stateProvider.
		state('listTrader', {
			url: '/traders',
			templateUrl: 'modules/trader/views/list-traders.client.view.html'
		}).
		state('createTrader', {
			url: '/trader/create',
			templateUrl: 'modules/trader/views/create-trader.client.view.html'
		}).
		state('viewTrader', {
			url: '/trader/:id',
			templateUrl: 'modules/trader/views/view-trader.client.view.html'
		}).
		state('editTrader', {
			url: '/trader/:id/edit',
			templateUrl: 'modules/trader/views/edit-trader.client.view.html'
		});
	}
]);