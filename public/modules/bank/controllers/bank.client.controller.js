'use strict';

angular.module(ApplicationConfiguration.modules.bank)
.controller('BankController', [
	'$stateParams', 
	ApplicationConfiguration.services.authentication,
	ApplicationConfiguration.services.bank, 
	ApplicationConfiguration.services.transaction,
	ApplicationConfiguration.services.utilities,
	function($stateParams, Authentication, bankSrv, transactionSrv, utilSrv) {
		var vm = this;

		// Initialize
		vm.authentication 	= Authentication;
		vm.bank 			= {};
		vm.bank.account 	= {};
		vm.listTransaction	= [];
		vm.currentPage 		= 1;
  		vm.pageSize 		= 10;

  		// Populate functions to controller object
		vm.fnInitLoadChips	= fnInitLoadChips;
		vm.fnLoadChips 		= fnLoadChips;
		vm.fnRead 			= fnRead;
		vm.fnUpdate    		= fnUpdate;

		/*jshint latedef: false */
  		function fnInitLoadChips(){
			// Load object for editing
			fnRead()
			.then(function(){
				// Load list of transactions
				fnLoadChipsHistoryTransactions();
			});
  		}

  		function fnLoadChipsHistoryTransactions(){
  			return transactionSrv.fnListByUser(vm.bank._id)
			.then(function(result) {
				vm.listTransaction = result;
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
  		}

  		function fnLoadChips(){
  			bankSrv.fnLoadChips(vm.chipsAmount)
  			.then(function(){
				// Update list of transactions
				fnRead();
				fnLoadChipsHistoryTransactions();
				vm.chipsAmount = '';
  			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
  		}

		function fnRead() {
			return bankSrv.fnRead()
			.then(function(result) {
				vm.bank = result;
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnUpdate() {
			bankSrv.fnUpdate(vm.bank)
			.then(function() {
				utilSrv.util.go('viewBank');
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}
	}
]);