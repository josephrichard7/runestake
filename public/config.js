'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName 	= 'runestake';
	var modules = {
		account: 		'account',
		articles: 		'articles',
		bank: 			'bank',
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
		user: 			'users'
	};
	var services = {
		account: 		'AccountService',
		authentication: 'Authentication',
		bank: 			'BankService',
		chat: 			'ChatService',
		exchangerate: 	'ExchangerateService',
		gambler: 		'GamblerService',
		gamblerchat: 	'GamblerChatService',
		gamblermain: 	'GamblermainService',
		menu: 			'Menus',
		service: 		'ServiceService',
		trader: 		'TraderService',
		tradermain: 	'TradermainService',
		transaction: 	'TransactionService',
		utilities: 		'UtilitiesService'
	};
	var factories = {
		chat: 			'ChatFactory',
		socket: 		'SocketFactory'
	};
	var sockets = {
		services: 		'/services'
	};
	var chats 	= {
		chat: 			'/chat'
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
		chats: 									chats,
		factories: 								factories,
		modules: 								modules,
		services: 								services,
		sockets: 								sockets,
		registerModule: 						registerModule
	};
})();