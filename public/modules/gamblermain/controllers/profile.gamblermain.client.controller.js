'use strict';

angular.module(ApplicationConfiguration.modules.gamblermain)
.controller('ProfileGamblermainController', 
	['$scope',
	 ApplicationConfiguration.services.gamblermain, 
	function($scope, gamblermainSrv) {
		var vm = this;

		// Initialize
		vm.gamblermainSrv 	= gamblermainSrv;

  		// Populate functions to controller object
		vm.fnInit 		= fnInit;

		/*jshint latedef: false*/
		function fnInit(){
			vm.gamblermainSrv.fnLoadUser();
  		}

	}
]);