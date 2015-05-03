'use strict';

angular.module(ApplicationConfiguration.modules.trader)
.service(ApplicationConfiguration.services.trader, [
	'$resource',
	ApplicationConfiguration.services.account,
	function($resource, accountSrv) {
		var _this = this;

		var TraderResource = $resource('trader/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		_this.fnReadById = function(id){
			return TraderResource.get({
				id: id
			}).$promise
			.then(function(trader){
				return accountSrv.fnReadAccountByUserId(trader._id)
				.then(function(account){
					trader.account = account;
					return trader;
				});
			});
		};

		_this.fnCreate = function(traderVO) {
			var trader = new TraderResource(traderVO);
			return trader.$save();
		};

		_this.fnDelete = function(id) {
			return TraderResource.$delete({
				id: id
			});
		};

		_this.fnUpdate = function(traderVO) {
			var trader = new TraderResource(traderVO);
			return trader.$update();
		};

		_this.fnList = function() {
			return TraderResource.query();
		};
	}
]);