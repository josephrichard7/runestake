'use strict';

angular.module('trader').controller('TraderController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trader', 'Account', 'Utilities',
	function($scope, $stateParams, $location, Authentication, Trader, Account, Utilities) {
		var vm = this;

		// Initialize
		vm.authentication 	= Authentication;
		vm.trader 			= {};
		vm.trader.account 	= {};
		vm.traders			= [];
		vm.ranks 			= [];
		vm.states 			= [];
		vm.currentPage 		= 1;
  		vm.pageSize 		= 10;

  		// Populate functions to controller object
		vm.fnCreate    = fnCreate;
		vm.fnUpdate    = fnUpdate;
		vm.fnDelete    = fnDelete;
		vm.fnList      = fnList;
		vm.fnReadByID  = fnReadByID;
		vm.fnInitCreate= fnInitCreate;
		vm.fnInitEdit  = fnInitEdit;

		/*jshint latedef: false */
		function fnCreate() {
			var trader = new Trader(vm.trader);
			trader.$save(function(response) {
				vm.trader  = {};
				$location.path('trader/' + response._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnDelete(trader) {
			if (trader) {
				trader.$remove(function(response) {
					for (var i in vm.traders) {
						if (vm.traders[i]._id === response._id) {
							vm.traders.splice(i, 1);
						}
					}
				}, function(errorResponse) {
					vm.error = errorResponse.data.message;
				});
			} else {
				vm.trader.$remove(function() {
					$location.path('traders');
				}, function(errorResponse) {
					vm.error = errorResponse.data.message;
				});
			}
		}

		function fnUpdate() {
			var trader = vm.trader;

			trader.$update(function(response) {
				$location.path('trader/' + response._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		}

		function fnList() {
			vm.traders = Trader.query();
		}

		function fnReadByID() {
			Trader.get({
				id: $stateParams.id
			},function(result){
				vm.trader 			= result;
				vm.trader.account 	= Account.get({userId: vm.trader._id});
			});
		}

		function fnInitCreate(){
  			fnLoadEnums();
  		}

  		function fnInitEdit(){
  			fnLoadEnums();
			// Load object for editing
			fnReadByID();
  		}

  		function fnLoadEnums(){
	  		// Load enums in edit view
			Utilities.enumResource.get({name: Utilities.enumName.TRADERRANK, type: Utilities.enumType.ARRAY},function(result){
				vm.ranks = result.data;
			});
			Utilities.enumResource.get({name: Utilities.enumName.USERSTATE, type: Utilities.enumType.ARRAY},function(result){
				vm.states = result.data;
			});
  		}
	}
]);