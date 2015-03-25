'use strict';

//Account service used for communicating with the account REST endpoints
angular.module('account').factory('Account', ['$resource',
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