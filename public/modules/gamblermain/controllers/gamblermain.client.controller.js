'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('GamblermainController', [
	ApplicationConfiguration.services.gamblermain,
	function(gamblermainSrv) {
		var vm = this;

		// Initialize
		vm.gamblermainSrv 	= gamblermainSrv;

	}
]);