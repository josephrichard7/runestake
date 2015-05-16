'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('TradermainController', [
	ApplicationConfiguration.services.tradermain,
	function(tradermainSrv) {
		var vm = this;

		// Initialize
		vm.tradermainSrv 	= tradermainSrv;

	}
]);