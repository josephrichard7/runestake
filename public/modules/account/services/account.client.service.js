'use strict';

angular.module(ApplicationConfiguration.modules.account)
.service(ApplicationConfiguration.services.account, 
	['$resource',
	function($resource) {
		var _this = this;

		_this.accountResource = $resource('account/:id/user/:userId', {
			id: '@_id',
			userId: '@userId'
		}, {
			update: {
				method: 'PUT'
			}
		});

		_this.fnReadAccountByUserId = function(userId){
			return _this.accountResource.get({
				userId: userId
			}).$promise;
		};
	}
]);