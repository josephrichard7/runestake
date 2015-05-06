'use strict';

angular.module(ApplicationConfiguration.modules.transaction)
.controller('TransactionController', [
	'$stateParams', 
	ApplicationConfiguration.services.authentication,
	ApplicationConfiguration.services.transaction,
	function($stateParams, Authentication, transactionSrv) {
		var vm = this;

		// Initialize
		vm.authentication 	= Authentication;
		vm.transaction 		= {};
		vm.listTransaction	= [];
		vm.currentPage 		= 1;
  		vm.pageSize 		= 10;

  		// Populate functions to controller object
		vm.fnReadById  	= fnReadById;
		vm.fnList    	= fnList;

		/*jshint latedef: false */
		function fnReadById() {
			transactionSrv.fnReadById($stateParams.id)
			.then(function(result) {
				vm.transaction = result;
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

  		function fnList(){
			// Load object for editing
			transactionSrv.fnListByUser()
			.then(function(result) {
				vm.listTransaction = result;
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
  		}
	}
]);