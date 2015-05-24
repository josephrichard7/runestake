'use strict';

// Users service used for communicating with the users REST endpoint
angular.module(ApplicationConfiguration.modules.user)
.factory(ApplicationConfiguration.services.user, [
	'$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);