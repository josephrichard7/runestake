'use strict';

angular.module(ApplicationConfiguration.modules.bankmain)
.controller('ProfileBankmainController', 
	['$scope',
	 ApplicationConfiguration.services.bankmain, 
	function($scope, bankmainSrv) {
		var vm = this;

		// Initialize
		vm.bankmainSrv 	= bankmainSrv;

  		// Populate functions to controller object
		vm.fnInit 		= fnInit;

		/*jshint latedef: false*/
		function fnInit(){
			vm.bankmainSrv.fnLoadUser();
  		}

	}
]);