'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.tradermain)
.config([
	'$stateProvider',
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
		.state('tradermainState.cashier', {
			abstract: true,
			url: '/panel/cashier',
			views: {
				'':{
					templateUrl: 'modules/tradermain/views/cashier.tradermain.client.view.html'
				},
				'ServicesHistoryCashierTradermainView@tradermainState.cashier':{
					templateUrl: 'modules/tradermain/views/serviceshistory.cashier.tradermain.client.view.html'	
				}
		    }
		})
		.state('tradermainState.cashier.createsrv', {
			url: '/createsrv',
			views: {
				'@tradermainState.cashier': {
					templateUrl: 'modules/tradermain/views/createsrv.cashier.tradermain.client.view.html'
				}
		    }
		})
		.state('tradermainState.cashier.srvcreated', {
			url: '/srvcreated/:id',
			views: {
				'@tradermainState.cashier': {
					templateUrl: 'modules/tradermain/views/srvcreated.cashier.tradermain.client.view.html'
				}
		    }
		})
		.state('tradermainState.cashier.srvstate', {
			url: '/srvstate/:id',
			views: {
				'@tradermainState.cashier': {
					templateUrl: 'modules/tradermain/views/srvstate.cashier.tradermain.client.view.html'
				}
		    }
		})
		;
	}
]);