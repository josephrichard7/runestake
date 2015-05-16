'use strict';

angular.module(ApplicationConfiguration.modules.tradermain)
.controller('ProfileTradermainController', [
	ApplicationConfiguration.services.tradermain, 
	function(tradermainSrv) {
		var vm = this;

		// Initialize
		vm.tradermainSrv 	= tradermainSrv;

  		// Populate functions to controller object
		vm.fnInit 		= fnInit;

		/*jshint latedef: false*/
		function fnInit(){
			vm.tradermainSrv.fnLoadUser();
  		}

	}
]);