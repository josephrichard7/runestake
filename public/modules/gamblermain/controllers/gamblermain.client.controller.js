'use strict';

angular.module('gamblermain').controller('GamblermainController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gamblermain', 'Account',
	function($scope, $stateParams, $location, Authentication, GamblermainSrv, Account) {
		var vm = this;

		// Initialize
		vm.authentication 	= Authentication;
		vm.gambler 			= {};
		vm.gambler.account 	= {};

  		// Populate functions to controller object
		vm.fnReadByID = fnReadByID;
		vm.fnInitEdit = fnInitEdit;

		function fnReadByID(){
			GamblermainSrv.gamblerResource.get({
				gamblerId: vm.authentication.user._id
			},function(result){
				vm.gambler 			= result;
				vm.gambler.account 	= Account.get({userId: vm.gambler._id});
			});
		}

		function fnInitEdit(){
			// Load object for editing
			fnReadByID();
  		}
	}
]);