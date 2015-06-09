'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.gamblermain)
.config([
	'$stateProvider',
	function($stateProvider) {
		// State routing
		$stateProvider
		.state('gamblermainState', {
			abstract: true,
			url: '/gamblermain',
			templateUrl: 'modules/gamblermain/views/gamblermain.client.view.html'	
		})
		.state('gamblermainState.panel', {
			url: '/panel',
			templateUrl: 'modules/gamblermain/views/panel.gamblermain.client.view.html'
		})
		.state('gamblermainState.cashier', {
			abstract: true,
			url: '/panel/cashier',
			views: {
				'':{
					templateUrl: 'modules/gamblermain/views/cashier.gamblermain.client.view.html'
				},
				'ServicesHistoryCashierGamblermainView@gamblermainState.cashier': {
					templateUrl: 'modules/gamblermain/views/serviceshistory.cashier.gamblermain.client.view.html'
				}
		    }
		})
		.state('gamblermainState.cashier.createsrv', {
			url: '/createsrv',
			views: {
				'@gamblermainState.cashier': {
					templateUrl: 'modules/gamblermain/views/createsrv.cashier.gamblermain.client.view.html'
				}
		    }
		})
		.state('gamblermainState.cashier.srvcreated', {
			url: '/srvcreated/:id',
			views: {
				'@gamblermainState.cashier': {
					templateUrl: 'modules/gamblermain/views/srvcreated.cashier.gamblermain.client.view.html'
				}
		    }
		})
		.state('gamblermainState.cashier.srvstate', {
			url: '/srvstate/:id',
			views: {
				'@gamblermainState.cashier': {
					templateUrl: 'modules/gamblermain/views/srvstate.cashier.gamblermain.client.view.html'
				}
		    }
		})
		.state('gamblermainState.stake', {
			abstract: true,
			url: '/stake',
			views: {
				'':{
					templateUrl: 'modules/gamblermain/views/stake.gamblermain.client.view.html'
				}
			}
		})
		.state('gamblermainState.stake.bet', {
			url: '/bet',
			views: {
				'@gamblermainState.stake': {
					templateUrl: 'modules/gamblermain/views/bet.stake.gamblermain.client.view.html'
				}
			}
		})
		.state('gamblermainState.stake.lobby', {
			url: '/lobby',
			views: {
				'@gamblermainState.stake': {
					templateUrl: 'modules/gamblermain/views/lobby.stake.gamblermain.client.view.html'
				}
			}
		})
		.state('gamblermainState.stake.play', {
			url: '/play/:id',
			views: {
				'@gamblermainState.stake': {
					templateUrl: 'modules/gamblermain/views/play.stake.gamblermain.client.view.html'
				}
			}
		})
		.state('gamblermainState.stake.finish', {
			url: '/finish/:id',
			views: {
				'@gamblermainState.stake': {
					templateUrl: 'modules/gamblermain/views/finish.stake.gamblermain.client.view.html'
				}
			}
		})
		;
	}
]);