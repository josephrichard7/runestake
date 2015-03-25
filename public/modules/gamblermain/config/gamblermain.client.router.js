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
		// .state('gamblermainState.cashier', {
		// 	url: '/cashier',
		// 	templateUrl: 'modules/gamblermain/views/cashier.gamblermain.client.view.html'
		// })
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