'use strict';

angular.module(ApplicationConfiguration.modules.core)
.controller('HomeController', [
	'$scope', 
	ApplicationConfiguration.services.authentication,
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);