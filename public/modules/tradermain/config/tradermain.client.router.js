'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.tradermain)
.config(['$stateProvider',
	function($stateProvider) {
		// State routing
		$stateProvider
		.state('tradermainState', {
			abstract: true,
			url: '/tradermain',
			templateUrl: 'modules/tradermain/views/tradermain.client.view.html'	
		})
		.state('tradermainState.panel', {
			url: '/panel',
			templateUrl: 'modules/tradermain/views/panel.tradermain.client.view.html'
		})
		.state('tradermainState.services', {
			url: '/panel/services',
			views: {
				'':{
					templateUrl: 'modules/tradermain/views/services.tradermain.client.view.html'
				},
				'ServicesAttendingTradermainView@tradermainState.services':{
					templateUrl: 'modules/tradermain/views/attending.services.tradermain.client.view.html'
				},
				'HistoryServicesTradermainView@tradermainState.services': {
					templateUrl: 'modules/tradermain/views/serviceshistory.services.tradermain.client.view.html'
				}
		    }
		})
		;
	}
]);