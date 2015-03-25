'use strict';

angular.module('gamblermain').controller('GamblermainController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gamblermain', 'Account',
	function($scope, $stateParams, $location, Authentication, Gamblermain, Account) {
		var vm = this;
		var fnInitGamblermain,
			fnReadByID,
			fnInitEdit;

		// Initialize
		vm.authentication 	= Authentication;
		vm.gambler 			= {};
		vm.gambler.account 	= {};

		fnReadByID = function(){
			Gamblermain.get({
				gamblerId: vm.authentication.user._id
			},function(result){
				vm.gambler 			= result;
				vm.gambler.account 	= Account.get({userId: vm.gambler._id});
			});
		};

		fnInitEdit = function(){
			// Load object for editing
			fnReadByID();
  		};

  		// Populate functions to controller object
		vm.fnReadByID = fnReadByID;
		vm.fnInitEdit = fnInitEdit;
	}
]);