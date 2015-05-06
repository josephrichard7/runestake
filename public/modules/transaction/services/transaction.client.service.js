'use strict';

angular.module(ApplicationConfiguration.modules.transaction)
.service(ApplicationConfiguration.services.transaction, [
	'$resource',
	function($resource) {
		var _this = this;

		var TransactionResource 		= $resource('transaction/:id');
		var TransactionByUserResource 	= $resource('transaction/user/:userId');

		_this.fnReadById = function(id){
			return TransactionResource.get({
				id: id
			}).$promise;
		};

		_this.fnListByUser = function(userId) {
			return TransactionByUserResource.query({
				userId: userId
			}).$promise;
		};
	}
]);