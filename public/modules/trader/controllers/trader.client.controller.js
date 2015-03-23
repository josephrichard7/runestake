'use strict';

angular.module('trader').controller('TraderController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trader', 'Utilities',
	function($scope, $stateParams, $location, Authentication, Trader, Utilities) {
		var vm 		= this;
		var ranks 	= [];
		var states 	= [];
		var fnCreate,
			fnRead,
			fnUpdate,
			fnDelete,
			fnList,
			fnReadByID;

		vm.authentication = Authentication;
		Utilities.enumResource.get({enumName: 'traderrank'},function(result){
			vm.ranks = result.data;
		});
		Utilities.enumResource.get({enumName: 'userstate'},function(result){
			vm.states = result.data;
		});
		vm.currentPage = 1;
  		vm.pageSize = 10;

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
			vm.trader = Trader.get({
				id: $stateParams.id
			});
		};

		vm.fnCreate    = fnCreate;
		vm.fnRead      = fnRead;
		vm.fnUpdate    = fnUpdate;
		vm.fnDelete    = fnDelete;
		vm.fnList      = fnList;
		vm.fnReadByID  = fnReadByID;
	}
]);