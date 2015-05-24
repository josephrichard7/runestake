'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.bankmain)
.config([
	'$stateProvider',
	function($stateProvider) {
		// State routing
		$stateProvider
		.state('bankmainState', {
			abstract: true,
			url: '/bankmain',
			templateUrl: 'modules/bankmain/views/bankmain.client.view.html'	
		})
		.state('bankmainState.panel', {
			url: '/panel',
			templateUrl: 'modules/bankmain/views/panel.bankmain.client.view.html'
		})
		.state('bankmainState.services', {
			url: '/panel/services',
			views: {
				'':{
					templateUrl: 'modules/bankmain/views/services.bankmain.client.view.html'
				},
				'ServicesAttendingBankmainView@bankmainState.services':{
					templateUrl: 'modules/bankmain/views/attending.services.bankmain.client.view.html'
				},
				'HistoryServicesBankmainView@bankmainState.services': {
					templateUrl: 'modules/bankmain/views/serviceshistory.services.bankmain.client.view.html'
				}
		    }
		})
		;
	}
]);