'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('GamblermainController', 
	['$scope',
	ApplicationConfiguration.services.gamblermain,
	function($scope, gamblermainSrv) {
		var vm = this;

		// Initialize
		vm.gamblermainSrv 	= gamblermainSrv;

	}
]);