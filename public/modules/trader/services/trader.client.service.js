'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('trader').factory('Trader', ['$resource',
	function($resource) {
		return $resource('trader/:traderId', {
			traderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);