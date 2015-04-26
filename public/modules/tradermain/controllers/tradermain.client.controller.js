'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('TradermainController', 
	['$scope',
	ApplicationConfiguration.services.tradermain,
	function($scope, tradermainSrv) {
		var vm = this;

		// Initialize
		vm.tradermainSrv 	= tradermainSrv;

	}
]);