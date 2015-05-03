'use strict';

angular.module(ApplicationConfiguration.modules.gambler)
.service(ApplicationConfiguration.services.gambler, [
	'$resource',
	ApplicationConfiguration.services.account,
	function($resource, accountSrv) {
		var _this = this;

		var gamblerResource = $resource('gambler/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		_this.fnReadById = function(id){
			return gamblerResource.get({
				id: id
			}).$promise
			.then(function(gambler){
				return accountSrv.fnReadAccountByUserId(gambler._id)
				.then(function(account){
					gambler.account = account;
					return gambler;
				});
			});
		};
	}
]);