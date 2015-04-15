'use strict';

angular.module(ApplicationConfiguration.modules.account)
.factory(ApplicationConfiguration.services.account, 
	['$resource',
	function($resource) {
		return $resource('account/:id/user/:userId', {
			id: '@_id',
			userId: '@userId'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);