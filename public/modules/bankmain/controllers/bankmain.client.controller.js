'use strict';

angular.module(ApplicationConfiguration.modules.bankmain)
.controller('BankmainController', 
	['$scope',
	ApplicationConfiguration.services.bankmain,
	function($scope, bankmainSrv) {
		var vm = this;

		// Initialize
		vm.bankmainSrv 	= bankmainSrv;

	}
]);