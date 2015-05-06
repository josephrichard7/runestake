'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.transaction)
.config([
	'$stateProvider',
	function($stateProvider) {
		// Transaction state routing
		$stateProvider.
		state('listTransaction', {
			url: '/transaction',
			templateUrl: 'modules/transaction/views/list.transaction.client.view.html'
		});
	}
]);