'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName 	= 'runestake';
	var modules = {
		account: 		'account',
		bank: 			'bank',
		bankmain:		'bankmain',
		chat: 			'chat',
		core: 			'core',
		exchangerate: 	'exchangerate',
		gambler: 		'gambler',
		gamblermain: 	'gamblermain',
		global: 		'global',
		service: 		'service',
		trader: 		'trader',
		tradermain: 	'tradermain',
		transaction: 	'transaction',
		user: 			'user'
	};
	var services = {
		account: 			'AccountService',
		authentication: 	'AuthenticationService',
		bank: 				'BankService',
		bankmain: 			'BankmainService',
		cashiertradermain: 	'CashierTradermainService',
		chat: 				'ChatService',
		exchangerate: 		'ExchangerateService',
		gambler: 			'GamblerService',
		gamblerchat: 		'GamblerChatService',
		gamblermain: 		'GamblermainService',
		game: 				'GameService',
		menu: 				'MenuService',
		service: 			'ServiceService',
		trader: 			'TraderService',
		tradermain: 		'TradermainService',
		transaction: 		'TransactionService',
		utilities: 			'UtilitiesService',
		user: 				'UserService'
	};
	var factories = {
		chat: 			'ChatFactory',
		socket: 		'SocketFactory'
	};
	var sockets = {
		app: 			'/app',
		bankservices: 	'/bankServices',
		chat: 			'/chat',
		bankservices: 	'/game',
		services: 		'/services'
	};
	var applicationModuleVendorDependencies = [
		'ngResource', 
		'ngCookies',  
		'ngAnimate',  
		'ngTouch',  
		'ngSanitize',  
		'ui.router', 
		'ui.bootstrap', 
		'ui.utils', 
		'angularUtils.directives.dirPagination'
	];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: 					applicationModuleName,
		applicationModuleVendorDependencies: 	applicationModuleVendorDependencies,
		factories: 								factories,
		modules: 								modules,
		services: 								services,
		sockets: 								sockets,
		registerModule: 						registerModule
	};
})();