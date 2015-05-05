'use strict';

angular.module(ApplicationConfiguration.modules.trader)
.controller('TraderController', [
	'$stateParams', 
	ApplicationConfiguration.services.authentication,
	ApplicationConfiguration.services.trader, 
	ApplicationConfiguration.services.utilities,
	function($stateParams, Authentication, traderSrv, utilSrv) {
		var vm = this;

		// Initialize
		vm.authentication 	= Authentication;
		vm.trader 			= {};
		vm.trader.account 	= {};
		vm.traders			= [];
		vm.traderRanks 		= [];
		vm.userStates 		= [];
		vm.currentPage 		= 1;
  		vm.pageSize 		= 10;

  		// Populate functions to controller object
		vm.fnInitCreate= fnInitCreate;
		vm.fnInitEdit  = fnInitEdit;
		vm.fnCreate    = fnCreate;
		vm.fnUpdate    = fnUpdate;
		vm.fnDelete    = fnDelete;
		vm.fnList      = fnList;
		vm.fnReadById  = fnReadById;

		/*jshint latedef: false */
		function fnCreate() {
			traderSrv.fnCreate(vm.trader)
			.then(function(response) {
				vm.trader  = {};
				utilSrv.util.go('viewTrader',{
					id: response._id
				});
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnDelete(trader) {
			var index;
			if (trader) {
				for (index in vm.traders) {
					if (vm.traders[index]._id === trader._id) {
						break;
					}
				}
				traderSrv.fnDelete(trader._id)
				.then(function(response) {
					vm.traders.splice(index, 1);
				}, function(errorResponse) {
					vm.error = errorResponse.data.message;
				});
			} else {
				traderSrv.fnDelete(vm.trader._id)
				.then(function() {
					utilSrv.util.go('listTrader');
				}, function(errorResponse) {
					vm.error = errorResponse.data.message;
				});
			}
		}

		function fnUpdate() {
			traderSrv.fnUpdate(vm.trader)
			.then(function(response) {
				utilSrv.util.go('viewTrader',{
					id: response._id
				});
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnList() {
			traderSrv.fnList()
			.then(function(list) {
				vm.traders = list;
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnReadById() {
			traderSrv.fnReadById($stateParams.id)
			.then(function(result) {
				vm.trader = result;
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnInitCreate(){
  			fnLoadEnums();
  		}

  		function fnInitEdit(){
  			fnLoadEnums();
			// Load object for editing
			fnReadById();
  		}

  		function fnLoadEnums(){
	  		// Load enums in edit view
	  		utilSrv.util.fnLoadEnumArray(utilSrv.enumName.TRADERRANK)
	  		.then(function(result){
	  			vm.traderRanks = result.data;
	  		});
	  		utilSrv.util.fnLoadEnumArray(utilSrv.enumName.USERSTATE)
	  		.then(function(result){
	  			vm.userStates = result.data;
	  		});
  		}
	}
]);