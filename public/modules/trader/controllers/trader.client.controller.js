'use strict';

angular.module('trader').controller('TraderController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trader', 'Account', 'Utilities',
	function($scope, $stateParams, $location, Authentication, Trader, Account, Utilities) {
		var vm = this;
		var fnCreate,
			fnRead,
			fnUpdate,
			fnDelete,
			fnList,
			fnReadByID,
			fnInitCreate,
			fnInitEdit,
			fnLoadEnums;

		// Initialize
		vm.authentication 	= Authentication;
		vm.trader 			= {};
		vm.trader.account 	= {};
		vm.traders			= [];
		vm.ranks 			= [];
		vm.states 			= [];
		vm.currentPage 		= 1;
  		vm.pageSize 		= 10;

		fnCreate = function() {
			var trader = new Trader(vm.trader);
			trader.$save(function(response) {
				vm.trader  = {};
				$location.path('trader/' + response._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};

		fnDelete= function(trader) {
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
				vm.trader.$remove(function(response) {
					$location.path('traders');
				}, function(errorResponse) {
					vm.error = errorResponse.data.message;
				});
			}
		};

		fnUpdate = function() {
			var trader = vm.trader;

			trader.$update(function(response) {
				$location.path('trader/' + response._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};

		fnList = function() {
			vm.traders = Trader.query();
		};

		fnReadByID = function() {
			Trader.get({
				id: $stateParams.id
			},function(result){
				vm.trader 			= result;
				vm.trader.account 	= Account.get({userId: vm.trader._id});
			});
		};

		fnInitCreate = function(){
  			fnLoadEnums();
  		};

  		fnInitEdit = function(){
  			fnLoadEnums();
			// Load object for editing
			fnReadByID();
  		};

  		fnLoadEnums = function(){
	  		// Load enums in edit view
			Utilities.enumResource.get({enumName: 'traderrank'},function(result){
				vm.ranks = result.data;
			});
			Utilities.enumResource.get({enumName: 'userstate'},function(result){
				vm.states = result.data;
			});
  		};

  		// Populate functions to controller object
		vm.fnCreate    = fnCreate;
		vm.fnRead      = fnRead;
		vm.fnUpdate    = fnUpdate;
		vm.fnDelete    = fnDelete;
		vm.fnList      = fnList;
		vm.fnReadByID  = fnReadByID;
		vm.fnInitCreate= fnInitCreate;
		vm.fnInitEdit  = fnInitEdit;
	}
]);