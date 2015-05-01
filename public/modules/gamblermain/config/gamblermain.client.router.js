'use strict';

// Setting up route
angular.module(ApplicationConfiguration.modules.gamblermain)
.config(['$stateProvider',
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
			url: '/stake',
			templateUrl: 'modules/gamblermain/views/stake.gamblermain.client.view.html'
		})
		// .state('gamblermainState.game', {
		// 	url: '/game',
		// 	templateUrl: 'modules/gamblermain/views/game.gamblermain.client.view.html'
		// })
		// .state('gamblermainState.game.playing', {
		// 	url: '/playing',
		// 	templateUrl: 'modules/gamblermain/views/game.playing.gamblermain.client.view.html'
		// })
		// .state('gamblermainState.game.finish', {
		// 	url: '/finish',
		// 	templateUrl: 'modules/gamblermain/views/game.finish.gamblermain.client.view.html'
		// })
		;
	}
]);