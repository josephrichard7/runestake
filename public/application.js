'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName)
.config(
	['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Template required for pagination template
angular.module(ApplicationConfiguration.applicationModuleName)
.config(function(paginationTemplateProvider) {
    paginationTemplateProvider.setPath('lib/angularUtils-pagination/dirPagination.tpl.html');
});

// Register global utility functions
angular.module(ApplicationConfiguration.applicationModuleName)
.run(
	['$rootScope',
	  ApplicationConfiguration.services.utilities,
	function($rootScope, UtilitiesSrv){ 
  		$rootScope.util = UtilitiesSrv.util;
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});