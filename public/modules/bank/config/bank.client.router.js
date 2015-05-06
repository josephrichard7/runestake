'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.bank)
.config([
	'$stateProvider',
	function($stateProvider) {
		// Bank state routing
		$stateProvider.
		state('editBank', {
			url: '/bank/edit',
			templateUrl: 'modules/bank/views/edit.bank.client.view.html'
		}).
		state('viewBank', {
			url: '/bank',
			templateUrl: 'modules/bank/views/view.bank.client.view.html'
		}).
		state('loadChipsBank', {
			url: '/bank/loadchips',
			templateUrl: 'modules/bank/views/loadchips.bank.client.view.html'
		});
	}
]);