'use strict';

angular.module(ApplicationConfiguration.modules.account)
.service(ApplicationConfiguration.services.account, [
	'$resource',
	function($resource) {
		var _this = this;

		var AccountResource = $resource('account/:id/user/:userId');

		_this.fnReadAccountByUserId = function(userId){
			return AccountResource.get({
				userId: userId
			}).$promise;
		};
	}
]);