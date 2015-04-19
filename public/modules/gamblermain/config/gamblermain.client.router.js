'use strict';

// Setting up route
angular.module('gamblermain').config(['$stateProvider',
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
			templateUrl: 'modules/gamblermain/views/cashier.gamblermain.client.view.html'
		})
		.state('gamblermainState.cashier.createsrv', {
			url: ''
		})
		.state('gamblermainState.cashier.assigningsrv', {
			url: '/assigningsrv/:id',
			templateUrl: 'modules/gamblermain/views/assigningsrv.cashier.gamblermain.client.view.html'
		})
		// .state('gamblermainState.srvcanceled', {
		// 	url: '/panel/cashier/srvcanceled/:id',
		// 	templateUrl: 'modules/gamblermain/views/srvcanceled.cashier.gamblermain.client.view.html'
		// })
		// .state('gamblermainState.srvcompleted', {
		// 	url: '/panel/cashier/srvcompleted/:id',
		// 	templateUrl: 'modules/gamblermain/views/srvcompleted.cashier.gamblermain.client.view.html'
		// })
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