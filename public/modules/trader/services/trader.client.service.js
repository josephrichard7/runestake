'use strict';

//Trader service used for communicating with the trader REST endpoints
angular.module('trader').factory('Trader', ['$resource',
	function($resource) {
		return $resource('trader/:id', {
			id: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);