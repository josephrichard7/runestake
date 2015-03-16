'use strict';

angular.module('trader').controller('TraderController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trader',
	function($scope, $stateParams, $location, Authentication, Trader) {
		var vm = this;
		var ranks = ['PLATA','ORO','RUBY','ESMERALDA','DIAMANTE'];
		var fnCreate,
			fnRead,
			fnUpdate,
			fnDelete,
			fnList,
			fnObjectByID;

		vm.authentication = Authentication;
		vm.ranks = ranks;
		// vm.tableSearch = Utilities.tableSearch;
		vm.currentPage = 1;
  		vm.pageSize = 2;

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
				trader.$remove();

				for (var i in vm.traders) {
					if (vm.traders[i] === trader) {
						vm.traders.splice(i, 1);
					}
				}
			} else {
				vm.trader.$remove(function() {
					$location.path('traders');
				});
			}
		};

		fnUpdate = function() {
			var trader = vm.trader;

			trader.$update(function() {
				$location.path('trader/' + trader._id);
			}, function(errorResponse) {
				vm.error = errorResponse.data.message;
			});
		};

		fnList = function() {
			vm.traders = Trader.query();
		};

		fnObjectByID = function() {
			vm.trader = Trader.get({
				traderId: $stateParams.traderId
			});
		};

		vm.fnCreate      = fnCreate;
		vm.fnRead        = fnRead;
		vm.fnUpdate      = fnUpdate;
		vm.fnDelete      = fnDelete;
		vm.fnList        = fnList;
		vm.fnObjectByID  = fnObjectByID;
	}
]);