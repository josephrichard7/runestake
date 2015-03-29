'use strict';

//Gamblermain service used for communicating with the Gamblermain REST endpoints
angular.module('gamblermain').factory('Gamblermain', ['$resource',
	function($resource) {
		var service = {};

		service.gamblerResource = $resource('gamblermain/:gamblerId', {
			gamblerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});

		return service;
	}
]);